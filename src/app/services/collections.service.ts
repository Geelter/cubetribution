import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, combineLatestWith, from, map, retry, switchMap, throwError} from 'rxjs';
import {Collection} from '../models/collection';
import {Card} from '../models/card';
import {Tables} from '../models/supabase';
import {SupabaseClientService} from './supabase/supabase-client.service';
import {RequestState} from "../helpers/request-state.enum";

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private readonly supabase = inject(SupabaseClientService);

  private requestState = new BehaviorSubject<RequestState>(RequestState.Initial);
  requestState$ = this.requestState.asObservable();

  private collections = new BehaviorSubject<Map<number, Collection>>(
    new Map<number, Collection>()
  );
  collections$ = this.collections.asObservable().pipe(
    map((collectionMap) => Array.from(collectionMap.values()))
  );

  private selectedCollection = new BehaviorSubject<number | null>(null);
  selectedCollection$ = this.collections$.pipe(
    combineLatestWith(this.selectedCollection.asObservable()),
    map(([collections, chosenCollectionID]) =>
      collections.find(collection => collection.id == chosenCollectionID)
    )
  );

  getCollections() {
    if (this.requestState.getValue() == RequestState.Success) {
      return this.collections$;
    } else {
      return this.fetchCollections();
    }
  }

  fetchCollections() {
    this.setRequestState(RequestState.InProgress);

    return from(
      this.supabase.client
        .from('collections')
        .select()
        .returns<Tables<'collections'>[]>()
    ).pipe(
      switchMap((result) => {
        if (result.data && !result.error) {
          const fetchedCollections = result.data.map(
            (value) => new Collection(value)
          );
          this.collections.next(this.convertArrayToMap(fetchedCollections));
          this.setRequestState(RequestState.Success);
          return this.collections$;
        } else {
          this.setRequestState(RequestState.Failure);
          return throwError(() => new Error(result.error.message));
        }
      }),
      retry(2)
    );
  }

  async getCollections() {
    this.requestInProgress.next(true);

    const collections = await this.databaseService.fetchCollections();

    this.requestInProgress.next(false);

    if (collections) {
      this.collections.next(collections);
    }
  }

  clearFetchedCollections() {
    this.collections.next(null);
  }

  async createCollection(name: string, cards: Card[] = []) {
    this.requestInProgress.next(true);

    const createdCollection = await this.databaseService.createCollection(name, cards);

    if (createdCollection) {
      const currentCollections = this.collections.getValue() ?? new Map<number, Collection>();

      this.collections.next(currentCollections.set(createdCollection.id, createdCollection));
    }

    this.requestInProgress.next(false);
  }

  async addCardsToCollection(collection: Collection, cards: Card[]) {
    this.requestInProgress.next(true);

    const idsToAdd = cards
      .map(card => card.id)
      .filter(id => !collection.cardIDs.includes(id));

    const appendedIDs = [...idsToAdd, ...collection.cardIDs];

    await this.updateCollectionInState(collection, appendedIDs);

    this.requestInProgress.next(false);
  }

  async removeCardsFromCollection(collection: Collection, cards: Card[]) {
    this.requestInProgress.next(true);

    const idsToRemove = cards.map(card => card.id);
    const filteredIDs = collection.cardIDs.filter(id => !idsToRemove.includes(id));

    await this.updateCollectionInState(collection, filteredIDs);

    this.requestInProgress.next(false);
  }

  async deleteCollection(collection: Collection) {
    this.requestInProgress.next(true);

    const error = await this.databaseService.deleteCollection(collection.id);

    if (!error) {
      const collections = this.collections.getValue() ?? new Map<number, Collection>();

      collections.delete(collection.id);

      this.collections.next(collections);
    }

    this.requestInProgress.next(false);
  }

  private async updateCollectionInState(collection: Collection, cardIDs: string[]) {
    const collections = this.collections.getValue() ?? new Map<number, Collection>();

    const error = await this.databaseService.updateCollectionCards(collection.id, cardIDs);

    if (!error) {
      collection.cardIDs = cardIDs;
      collections.set(collection.id, collection);

      this.collections.next(collections);
      this.emitSelectedCollectionIfMatches(collection);
    }
  }

  private setRequestState(state: RequestState) {
    this.requestState.next(state);
  }

  selectCollection(collection: Collection) {
    this.selectedCollection.next(collection);
  }

  clearSelectedCollection() {
    this.selectedCollection.next(null);
  }
}
