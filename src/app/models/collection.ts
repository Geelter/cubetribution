import {Tables} from "./supabase";

export class Collection {
  private readonly _id: number;
  private readonly _createdAt: string;
  private _name: string;
  private _thumbnailURI: string;
  private _cardIDs: string[];

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(newName: string) {
    this._name = newName;
  }

  get thumbnailURI() {
    return this._thumbnailURI
  }

  set thumbnailURI(newURI: string) {
    this._thumbnailURI = newURI;
  }

  get cardIDs() {
    return this._cardIDs;
  }

  set cardIDs(ids: string[]) {
    this._cardIDs = ids;
  }

  constructor(data: Tables<'collections'>) {
    this._id = data.id;
    this._createdAt = data.created_at;
    this._name = data.name;
    this._thumbnailURI = data.thumbnail;
    this._cardIDs = data.card_ids;
  }
}
