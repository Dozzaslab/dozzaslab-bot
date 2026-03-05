
export function simulateTradeup(items) {

  if (items.length !== 10) {
    return { error: "Need 10 skins" }
  }

  const avgFloat =
    items.reduce((sum, item) => sum + item.float, 0) / 10

  const collections = {}

  for (const item of items) {
    collections[item.collection] =
      (collections[item.collection] || 0) + 1
  }

  const outcomes = []

  for (const collection in collections) {

    const weight = collections[collection] / 10

    outcomes.push({
      collection,
      probability: weight
    })

  }

  return {
    avgFloat,
    outcomes
  }

}
