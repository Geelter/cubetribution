import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Card} from "../models/card";
import {BehaviorSubject, catchError, forkJoin, Observable, of, switchMap, tap, throwError} from "rxjs";
import {ScryfallCollectionResponse} from "../models/scryfall-collection-response";
import {ScryfallAutocompleteResponse} from "../models/scryfall-autocomplete-response";

@Injectable({
  providedIn: 'root'
})
export class ScryfallService {
  private readonly BATCH_SIZE = 75;
  private readonly BASE_API_URL = 'https://api.scryfall.com/cards';

  private readonly http = inject(HttpClient);

  //TODO: Rewrite the code for flipping the subject value into something more elegant
  private fetchInProgress = new BehaviorSubject<boolean>(false);
  fetchInProgress$ = this.fetchInProgress.asObservable();

  getCardsForAutocomplete(param: string): Observable<Card[]> {
    this.fetchInProgress.next(true);

    const autocompleteURL = `${this.BASE_API_URL}/autocomplete?q=${param}`;

    return this.http.get<ScryfallAutocompleteResponse>(
      autocompleteURL,
      { headers: {'Content-Type': 'application/json'}}
    ).pipe(
      switchMap((value, _) => {
        this.fetchInProgress.next(false);
        return this.getCardsForIDs(value.data)
      })
    );
  }
  getCardsForIDs(ids: string[]): Observable<Card[]> {
    if (ids.length) {
      this.fetchInProgress.next(true);
    }

    const idSlices = this.sliceIDArray(ids);
    const payloads = idSlices.map(
      slice => this.convertIDSliceToScryfallPayload(slice)
    );
    const urls = this.createRequestsForPayloads(payloads);

    return forkJoin(urls).pipe(
      switchMap(responses =>
        of(responses.flatMap(response => {
          this.fetchInProgress.next(false);
          return response.data.map(value => new Card(value))
        }))
      ),
      catchError(response => {
        this.fetchInProgress.next(false);
        return throwError(() => new Error('Error fetching card collection'))
      })
    );
  }

  private sliceIDArray(ids: string[]): string[][] {
    let slices: string[][] = [];
    for (let i = 0; i < ids.length; i += this.BATCH_SIZE) {
      slices.push(ids.slice(i, i + this.BATCH_SIZE));
    }
    return slices;
  }

  private convertIDSliceToScryfallPayload(idSlice: string[]) {
    const idPattern = /^[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}$/;
    const dualNamePattern = /\/\/+/;

    const identifiers = idSlice.map(id => {
      const obj: any = {};

      let identifier = id.trim();
      const isID = idPattern.test(identifier);

      if (dualNamePattern.test(identifier)) {
        const parts = identifier.split(dualNamePattern);
        identifier = parts[0].trim();
      }

      if (isID) {
        obj.id = identifier;
      } else {
        obj.name = identifier;
      }

      return obj;
    });

    return { identifiers };
  }

  private createRequestsForPayloads(payloads: {identifiers: any[]}[]) {
    return payloads.map(payload => {
      return this.http.post<ScryfallCollectionResponse>(
        this.BASE_API_URL + '/collection',
        payload,
        { headers: {'Content-Type': 'application/json'} }
      )
    })
  }
}
