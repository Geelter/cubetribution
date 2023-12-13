import {Tables} from "./supabase";

export class Cube {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _thumbnailURI: string;
  private readonly _cardIDs: string[];
  private readonly _createdAt: string;

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get thumbnailURI() {
    return this._thumbnailURI;
  }

  get cardIDs() {
    return this._cardIDs;
  }

  constructor(data: Tables<'cubes'>) {
    this._id = data.id;
    this._name = data.name;
    this._thumbnailURI = data.thumbnail;
    this._cardIDs = data.card_ids;
    this._createdAt = data.created_at;
  }
}
