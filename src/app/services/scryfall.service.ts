import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Card, CardFace} from "../models/card";
import {catchError, forkJoin, Observable, of, switchMap, tap, throwError} from "rxjs";
import {ScryfallCollectionResponse} from "../models/scryfall-collection-response";

@Injectable({
  providedIn: 'root'
})
export class ScryfallService {
  private readonly BATCH_SIZE = 75;
  private readonly BASE_API_URL = 'https://api.scryfall.com/cards';

  private readonly http = inject(HttpClient);

  getCardsForIDs(ids: string[]): Observable<Card[]> {
    const idSlices = this.sliceIDArray(ids);
    const payloads = idSlices.map(
      slice => this.convertIDSliceToScryfallPayload(slice)
    );
    const urls = this.createRequestsForPayloads(payloads);

    return forkJoin(urls).pipe(
      switchMap(responses =>
        of(responses.flatMap(response => {
          return response.data.map(value => this.mapResponseDataToCard(value))
        }))
      ),
      tap(response => console.log(response)),
      catchError(
        respose => throwError(() => new Error('Error fetching card collection'))
      )
    );
  }

  private sliceIDArray(ids: string[]): string[][] {
    let slices: string[][] = [];
    for (let i = 0; i < ids.length; i += this.BATCH_SIZE) {
      slices.push(ids.slice(i, i + this.BATCH_SIZE));
    }
    return slices;
  }

  private convertIDSliceToScryfallPayload(idSlices: string[]) {
    const identifiers = idSlices.map(id => {
      return { id }
    });

    return { identifiers };
  }

  private createRequestsForPayloads(payloads: {identifiers: {id: string}[]}[]) {
    return payloads.map(payload => {
      return this.http.post<ScryfallCollectionResponse>(
        this.BASE_API_URL + '/collection',
        payload,
        { headers: {'Content-Type': 'application/json'} }
      )
    })
  }

  private mapResponseDataToCard(data: any): Card {
    const cardData: Card = {
      id: data.id,
      name: data.name,
      lang: data.lang,
      released_at: data.released_at,
      scryfall_uri: data.scryfall_uri,
      layout: data.layout,
      image_uris: data.image_uris ?? null,
      card_faces: null,
      mana_cost: data.mana_cost,
      cmc: data.cmc,
      type_line: data.type_line,
      oracle_text: data.oracle_text,
      power: data.power,
      toughness: data.toughness,
      colors: data.colors,
      color_identity: data.color_identity,
      rarity: data.rarity,
    }

    if (data.card_faces) {
      cardData.card_faces = data.card_faces.map((cardFace: CardFace) => {
        return {
          colors: cardFace.colors,
          mana_cost: cardFace.mana_cost,
          name: cardFace.name,
          oracle_text: cardFace.oracle_text,
          power: cardFace.power,
          toughness: cardFace.toughness,
          type_line: cardFace.type_line,
          image_uris: cardFace.image_uris ? cardFace.image_uris : null,
        }
      });
    }

    return cardData;
  }
}
