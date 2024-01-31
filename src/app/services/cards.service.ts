import {inject, Injectable} from '@angular/core';
import {Card} from "../models/card";
import {ScryfallService} from "./scryfall.service";
import {BehaviorSubject, catchError, from, map, switchMap, throwError} from "rxjs";
import {RequestState} from "../helpers/request-state.enum";

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private readonly scryfall = inject(ScryfallService);

  private fetchedCards: Map<string, Card> = new Map<string, Card>();
  private requestedCards = new BehaviorSubject<Card[]>([]);
  requestedCards$ = this.requestedCards.asObservable();

  private requestState = new BehaviorSubject<RequestState>(RequestState.Initial);
  requestState$ = this.requestState.asObservable();

  getCardsForIDs(cardIDs: string[]) {
    this.requestState.next(RequestState.InProgress);

    const missingIDs = this.filterOutPresentCards(cardIDs);

    if (!missingIDs.length) {
      return from(this.filterMap(cardIDs))
        .pipe(
          map(cards => {
            this.requestState.next(RequestState.Success);
            this.requestedCards.next(cards);
            return null;
          })
        )
    }

    return this.scryfall.getCardsForIDs(missingIDs)
      .pipe(
        catchError(error => {
          this.requestState.next(RequestState.Failure);
          return throwError(() => new Error(error));
        }),
        switchMap(cards => {
          cards.forEach(card => this.fetchedCards.set(card.id, card));
          return from(this.filterMap(cardIDs));
        }),
        map(cards => {
          this.requestedCards.next(cards);
          this.requestState.next(RequestState.Success);
          return null;
        })
      );
  }

  clearRequestedCards() {
    this.requestedCards.next([]);
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
