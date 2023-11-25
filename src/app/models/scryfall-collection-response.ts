import {Card} from "./card";

export interface ScryfallCollectionResponse {
  object: string,
  not_found: any[],
  data: Card[]
}
