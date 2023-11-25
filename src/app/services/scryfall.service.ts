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
}
