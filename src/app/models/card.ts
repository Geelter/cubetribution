export interface Card {
  id: string,
  name: string,
  lang: string,
  released_at: string,
  scryfall_uri: string,
  layout: string,
  image_uris: ImageURIs | null,
  card_faces: CardFace[] | null,
  mana_cost: string, /* {1}{R}{B} */
  cmc: number,
  type_line: string,
  oracle_text: string,
  power: string,
  toughness: string,
  colors: string[], /* ["R", "B"] */
  color_identity: string[], /* ["R", "B"] */
  rarity: string,
}

export interface CardFace {
  colors: string[],
  image_uris: ImageURIs | null,
  mana_cost: string,
  name: string,
  oracle_text: string,
  power: string,
  toughness: string,
  type_line: string,
}

interface ImageURIs {
  small: string,
  normal: string,
  large: string,
  png: string,
  art_crop: string,
  border_crop: string,
}
