// tradeup.js

export const rarityMap = {
  "Mil-Spec": "Restricted",
  "Restricted": "Classified",
  "Classified": "Covert"
};

// Мини-база outcomes (для теста). Потом расширишь.
export const outcomesDB = {
  "Anubis": {
    "Restricted": [
      { name: "AWP | Example Anubis R1", float_min: 0.00, float_max: 0.70 },
      { name: "M4A1-S | Example Anubis R2", float_min: 0.10, float_max: 0.80 }
    ]
  },
  "The Anubis Collection": {
    "Restricted": [
      { name: "AWP | Example Anubis R1", float_min: 0.00, float_max: 0.70 },
      { name: "M4A1-S | Example Anubis R2", float_min: 0.10, float_max: 0.80 }
    ]
  }
};

export function simulateTradeup(items, { rarityMapOverride, outcomesDBOverride } = {}) {
  const rm = rarityMapOverride || rarityMap;
  const db = outcomesDBOverride || outcomesDB;

  if (!Array.isArray(items) || items.length !== 10) {
    return { error: "Нужно ровно 10 предметов." };
  }

  // валидируем вход
  const rarities = new Set();
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it?.collection || typeof it.collection !== "string") {
      return { error: `Предмет ${i + 1}: нет collection` };
    }
    if (!it?.rarity || typeof it.rarity !== "string") {
      return { error: `Предмет ${i + 1}: нет rarity` };
    }
    if (typeof it.float !== "number" || Number.isNaN(it.float) || it.float < 0 || it.float > 1) {
      return { error: `Предмет ${i + 1}: float должен быть 0..1` };
    }
    rarities.add(it.rarity);
  }

  if (rarities.size !== 1) {
    return { error: "Все 10 предметов должны быть одной редкости." };
  }

  const inRarity = items[0].rarity;
  const outRarity = rm[inRarity];
  if (!outRarity) return { error: `Не знаю апгрейд для rarity: ${inRarity}` };

  const avgFloat = items.reduce((s, x) => s + x.float, 0) / 10;

  // доли коллекций
  const counts = {};
  for (const it of items) counts[it.collection] = (counts[it.collection] || 0) + 1;

  const outcomes = [];
  const missingCollections = [];

  for (const [collection, n] of Object.entries(counts)) {
    const pool = db?.[collection]?.[outRarity];
    if (!pool || !pool.length) {
      missingCollections.push(collection);
      continue;
    }

    const weightCol = n / 10;
    const k = pool.length;
    const pEach = weightCol / k;

    for (const o of pool) {
      const fOut = o.float_min + avgFloat * (o.float_max - o.float_min);
      outcomes.push({
        collection,
        name: o.name,
        prob: pEach,
        float_out: fOut
      });
    }
  }

  outcomes.sort((a, b) => b.prob - a.prob);

  return {
    input_rarity: inRarity,
    output_rarity: outRarity,
    avg_float: round6(avgFloat),
    outcomes: outcomes.map(x => ({
      ...x,
      prob: round6(x.prob),
      float_out: round6(x.float_out)
    })),
    missing_collections: missingCollections
  };
}

function round6(x) {
  return Math.round(x * 1e6) / 1e6;
}
