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
}
