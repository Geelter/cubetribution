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

export class Card {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _image_uris: ImageURIs | null;
  private readonly _card_faces: CardFace[] | null;
  private readonly _mana_cost: string; /* {1}{R}{B} */
  private readonly _cmc: number;
  // private _type_line: string;
  // private _colors: string[]; /* ["R", "B"] */
  private readonly _rarity: string;
  private readonly _scryfallURI: string;

  constructor(cardData: any) {
    this._id = cardData.id;
    this._name = cardData.name;
    this._image_uris = cardData.image_uris;
    this._card_faces = cardData.card_faces;
    this._mana_cost = cardData.mana_cost;
    this._cmc = cardData.cmc;
    this._rarity = cardData.rarity;
    this._scryfallURI = cardData.scryfall_uri;
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public get frontImageURIs() {
    if (this._image_uris != null) {
      return this._image_uris;
    } else {
      return this._card_faces![0].image_uris!;
    }
  }

  public get backImageURIs() {
    return this._card_faces?.[1].image_uris;
  }

  public get cardFaces() {
    return this._card_faces;
  }

  public get manaCost() {
    if (this._card_faces != null && this._card_faces[0].mana_cost != "") {
      return this._card_faces[0].mana_cost;
    } else if (this._mana_cost != "") {
      return this._mana_cost;
    } else {
      return "N/A";
    }
  }

  public get cmc() {
    return this._cmc;
  }

  public get rarity() {
    return this._rarity;
  }

  public get scryfallURI() {
    return this._scryfallURI;
  }

  public get isDoubleSided() {
    return !!(this._card_faces && this._card_faces[0].image_uris != null);
  }
}
