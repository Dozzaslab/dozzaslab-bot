// tradeup.js
// Загружает /data/skins.json (ByMykel CSGO-API) и строит индекс
// collection -> rarity -> [ { name, float_min, float_max, stash_url? } ]

let _dbPromise = null;
let _index = null;
let _collectionsList = null;

// Короткая карта апгрейда (канонические значения)
const RARITY_UP = {
  "Consumer": "Industrial",
  "Industrial": "Mil-Spec",
  "Mil-Spec": "Restricted",
  "Restricted": "Classified",
  "Classified": "Covert",
  // Covert -> Special (ножи/перчатки). В этой версии движка
  // считаем как "Extraordinary" (gold). Если в базе таких нет — outcomes будут пустыми.
  "Covert": "Extraordinary",
};

// --- Public API ---

export async function ensureTradeupReady() {
  if (_index) return { ok: true };

  if (!_dbPromise) {
    _dbPromise = (async () => {
      const res = await fetch("/data/skins.json", { cache: "force-cache" });
      if (!res.ok) throw new Error(`Не удалось загрузить /data/skins.json (HTTP ${res.status})`);
      const raw = await res.json();

      const { index, collectionsList } = buildIndex(raw);
      _index = index;
      _collectionsList = collectionsList;

      return { ok: true };
    })();
  }

  return _dbPromise;
}

export function getCollectionsList() {
  return _collectionsList || [];
}

/**
 * items: [{collection, rarity, float}, ...] (10 items)
 */
export function simulateTradeup(items) {
  if (!_index) return { error: "База ещё не загружена. Вызови ensureTradeupReady() перед расчетом." };

if (!Array.isArray(items) || (items.length !== 10 && items.length !== 5)) {
  return { error: "Нужно ровно 10 предметов (обычный контракт) или 5 предметов (Covert -> gold)." };
}
const N = items.length;
  // Validate and normalize
  const rarities = new Set();
  const normalized = items.map((it, i) => {
    const collection = (it?.collection || "").trim();
    const rarity = normalizeRarity(it?.rarity);
    const fl = Number(it?.float);

    if (!collection) throw new Error(`Предмет ${i + 1}: нет collection`);
    if (!rarity) throw new Error(`Предмет ${i + 1}: не распознана rarity`);
    if (Number.isNaN(fl) || fl < 0 || fl > 1) throw new Error(`Предмет ${i + 1}: float должен быть 0..1`);

    rarities.add(rarity);

    // Попробуем сопоставить collection с тем, что есть в базе (мягко)
    const matchedCollection = matchCollectionKey(collection, _index);

    return { collection: matchedCollection, rarity, float: fl, _rawCollection: collection };
  });

 if (rarities.size !== 1) {
  return { error: `Все предметы должны быть одной редкости.` };
}

const inRarity = normalized[0].rarity;

// Правило количества:
if (inRarity === "Covert" && N !== 5) {
  return { error: "Для Covert контракта нужно ровно 5 предметов (Covert -> gold)." };
}
if (inRarity !== "Covert" && N !== 10) {
  return { error: "Для этого контракта нужно ровно 10 предметов." };
}

  const outRarity = RARITY_UP[inRarity];
  if (!outRarity) return { error: `Нет апгрейда для rarity: ${inRarity}` };

  // Average float
  const avgFloat = normalized.reduce((s, x) => s + x.float, 0) / N;

  // Count collections
  const counts = {};
  for (const it of normalized) counts[it.collection] = (counts[it.collection] || 0) + 1;

  const outcomes = [];
  const missingCollections = [];
  let coveredProb = 0;

  for (const [collectionKey, n] of Object.entries(counts)) {
    const pool = _index?.[collectionKey]?.[outRarity];
    if (!pool || !pool.length) {
      missingCollections.push(collectionKey);
      continue;
    }

    const weightCol = n / N;
    const k = pool.length;
    const pEach = weightCol / k;

    for (const o of pool) {
      const fOut = o.float_min + avgFloat * (o.float_max - o.float_min);
      outcomes.push({
        collection: collectionKey,
        name: o.name,
        prob: pEach,
        float_out: fOut,
        stash_url: o.stash_url || null
      });
      coveredProb += pEach;
    }
  }

  outcomes.sort((a, b) => b.prob - a.prob);

  return {
    input_rarity: inRarity,
    output_rarity: outRarity,
    avg_float: round6(avgFloat),
    total_prob_covered: round6(coveredProb),
    missing_collections: missingCollections,
    outcomes: outcomes.map(o => ({
      collection: o.collection,
      name: o.name,
      prob: round6(o.prob),
      float_out: round6(o.float_out),
      // универсальные ссылки "где чекнуть цену"
      links: buildPriceLinks(o.name, o.stash_url)
    }))
  };
}

// --- Helpers ---

function buildIndex(rawSkins) {
  // В базе ByMykel это массив объектов; у разных версий могут отличаться поля.
  // Мы делаем максимально устойчивый парсер.
  const index = {};
  const collectionsSet = new Set();

  for (const s of Array.isArray(rawSkins) ? rawSkins : []) {
    const name = getName(s);
    const collection = getCollection(s);
    const rarity = normalizeRarity(getRarity(s));
    const range = getFloatRange(s);

    if (!name || !collection || !rarity || !range) continue;

    // Оставляем только “обычные” трейдап-редкости
    if (!RARITY_UP[rarity] && rarity !== "Covert") {
      // Consumer/Industrial/Mil-Spec/Restricted/Classified/Covert — ok
      // Всё остальное (например ножи/перчатки/агенты/стикеры) — пропускаем
      continue;
    }

    if (!index[collection]) index[collection] = {};
    if (!index[collection][rarity]) index[collection][rarity] = [];

    index[collection][rarity].push({
      name,
      float_min: range.min,
      float_max: range.max,
      stash_url: getStashUrl(s)
    });

    collectionsSet.add(collection);
  }

  // Сортируем outcomes внутри каждой группы по названию (для стабильности)
  for (const col of Object.keys(index)) {
    for (const rar of Object.keys(index[col])) {
      index[col][rar].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
  }

  const collectionsList = [...collectionsSet].sort((a, b) => a.localeCompare(b));
  return { index, collectionsList };
}

function getName(s) {
  return (s?.name || s?.market_hash_name || s?.marketHashName || "").trim();
}

function getCollection(s) {
  // ByMykel skins.json: коллекция(и) лежат в массиве collections[]
  const arr = s?.collections;
  if (Array.isArray(arr) && arr.length) {
    const c0 = arr[0];
    if (typeof c0 === "string") return c0.trim();
    if (typeof c0 === "object" && c0.name) return String(c0.name).trim();
  }

  // fallback на старые структуры (если вдруг другой json)
  const c = s?.collection;
  if (!c) return "";
  if (typeof c === "string") return c.trim();
  if (typeof c === "object" && c.name) return String(c.name).trim();
  return "";
}

function getRarity(s) {
  const r = s?.rarity;
  if (!r) return "";
  if (typeof r === "string") return r;
  if (typeof r === "object" && r.name) return String(r.name);
  return "";
}

function getFloatRange(s) {
  // В разных версиях могут быть разные поля
  const min =
    numOrNull(s?.min_float) ??
    numOrNull(s?.minFloat) ??
    numOrNull(s?.float_min) ??
    numOrNull(s?.floatMin);

  const max =
    numOrNull(s?.max_float) ??
    numOrNull(s?.maxFloat) ??
    numOrNull(s?.float_max) ??
    numOrNull(s?.floatMax);

  if (min === null || max === null) return null;
  // sanity
  if (min < 0 || max > 1 || min > max) return null;

  return { min, max };
}

function getStashUrl(s) {
  // Если в базе нет прямой ссылки — ок, будем давать поисковые ссылки.
  const url = s?.stash_url || s?.stashUrl || s?.url || "";
  if (typeof url === "string" && url.startsWith("http")) return url;
  return null;
}

function normalizeRarity(r) {
  if (!r) return "";
  const x = String(r).trim().toLowerCase();

  // Частые варианты
  if (x.includes("consumer")) return "Consumer";
  if (x.includes("industrial")) return "Industrial";
  if (x.includes("mil-spec") || x.includes("milspec")) return "Mil-Spec";
  if (x.includes("restricted")) return "Restricted";
  if (x.includes("classified")) return "Classified";
  if (x.includes("covert")) return "Covert";
  if (x.includes("extraordinary") || x.includes("gold") || x.includes("rare special")) return "Extraordinary";

  // Если пользователь вводит коротко
  if (x === "mil" || x === "mil-spec") return "Mil-Spec";
  return "";
}

function matchCollectionKey(input, index) {
  // 1) точное совпадение
  if (index[input]) return input;

  const inLower = input.toLowerCase();

  // 2) case-insensitive точное
  for (const key of Object.keys(index)) {
    if (key.toLowerCase() === inLower) return key;
  }

  // 3) частичное совпадение (если пользователь пишет "Anubis")
  // предпочтём самое короткое совпадение
  let best = null;
  for (const key of Object.keys(index)) {
    const k = key.toLowerCase();
    if (k.includes(inLower) || inLower.includes(k)) {
      if (!best || key.length < best.length) best = key;
    }
  }

  return best || input; // если не нашли — вернём как есть, дальше уйдёт в missing_collections
}

function buildPriceLinks(name, stashUrl) {
  const q = encodeURIComponent(name);

  return {
    stash: stashUrl || null,
    csfloat: `https://csfloat.com/search?query=${q}`,
    steam: `https://steamcommunity.com/market/search?q=${q}`,
    clash: `https://stash.clash.gg/search?query=${q}`
  };
}

function numOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function round6(x) {
  return Math.round(x * 1e6) / 1e6;
}
