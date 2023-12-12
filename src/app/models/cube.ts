import {Tables} from "./supabase";

export class Cube {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _thumbnail: string;
  private readonly _cardIDs: string[];
  private readonly _createdAt: string;

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get thumbnail() {
    return this._thumbnail;
  }

  get cardIDs() {
    return this._cardIDs;
  }

  constructor(data: Tables<'cubes'>) {
    this._id = data.id;
    this._name = data.name;
    this._thumbnail = data.thumbnail;
    this._cardIDs = data.card_ids;
    this._createdAt = data.created_at;
  }
}
