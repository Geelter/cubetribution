import {Tables} from "./supabase";

export class Donation {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _cubeID: number;
  private readonly _thumbnailURI: string;
  private readonly _cardIDs: string[];
  private readonly _accepted: boolean;

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get cubeID() {
    return this._cubeID;
  }

  get thumbnailURI() {
    return this._thumbnailURI;
  }

  get cardIDs() {
    return this._cardIDs;
  }

  get accepted() {
    return this._accepted;
  }

  constructor(data: Tables<'donations'>) {
    this._id = data.id;
    this._name = data.name;
    this._cubeID = data.cube_id;
    this._thumbnailURI = data.thumbnail;
    this._cardIDs = data.card_ids;
    this._accepted = data.accepted;
  }
}
