export function generateCardDataForID(id: string) {
  return {
    id: id,
    name: `card for ID ${id}`,
    image_uris: {
      small: `https://cards.scryfall.io/small/${id}.jpg`,
      normal: `https://cards.scryfall.io/normal/${id}.jpg`,
      large: `https://cards.scryfall.io/large/${id}.jpg`,
      png: `https://cards.scryfall.io/png/${id}.jpg`,
      art_crop: `https://cards.scryfall.io/art_crop/${id}.jpg`,
      border_crop: `https://cards.scryfall.io/border_crop/${id}.jpg`
    },
    mana_cost: '{1}{R}{B}',
    cmc: 3,
    rarity: 'rare',
    scryfallURI: `https://api.scryfall.com/cards/${id}`
  }
}
