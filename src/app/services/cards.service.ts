import {inject, Injectable} from '@angular/core';
import {Card} from "../models/card";
import {ScryfallService} from "./scryfall.service";
import {from, switchMap, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private readonly scryfallService = inject(ScryfallService);

  private fetchedCards: Map<string, Card> = new Map<string, Card>();

  getCardsForIDs(cardIDs: string[]) {
    const missingIDs = this.filterOutPresentCards(cardIDs);

    return missingIDs.length
      ? this.scryfallService.getCardsForIDs(missingIDs)
      .pipe(
        tap(cards => {
          cards.forEach(card => this.fetchedCards.set(card.id, card));
          console.log(this.fetchedCards)
        }),
        switchMap(_ => from(this.filterMap(cardIDs)))
      )
      : from(this.filterMap(cardIDs));
  }

  private filterMap(cardIDs: string[]) {
    let filtered: Card[] = [];

    return new Promise<Card[]>((resolve) => {
      setTimeout(() => {
        filtered = cardIDs.reduce((accumulator: Card[], id: string) => {
          const card = this.fetchedCards.get(id);

          if (card) {
            accumulator.push(card);
          }
          return accumulator;
        }, []);

        resolve(filtered);
      }, 0);
    });
  }

  private filterOutPresentCards(cardIDs: string[]) {
    return cardIDs.filter(id => !this.fetchedCards.has(id));
  }
}
