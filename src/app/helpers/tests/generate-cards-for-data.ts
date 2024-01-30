import {Card} from "../../models/card";

export function generateCardsForData(data: any[]): Card[] {
  return data.map(value => new Card(value))
}
