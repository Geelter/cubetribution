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

  createCollection(name: string, cards: Card[] = []) {
    this.setRequestState(RequestState.InProgress);
    const cardIDs = cards.map((card) => card.id);

    return from(
      this.supabase.client
        .from('collections')
        .insert({ name: name, card_ids: cardIDs })
        .select()
        .returns<Tables<'collections'>[]>()
    ).pipe(
      switchMap((result) => {
        if (result.data && !result.error) {
          const newCollection = new Collection(result.data[0]);

          this.setCollectionInState(newCollection);
          this.setRequestState(RequestState.Success);

          return this.getCollections();
        } else {
          this.setRequestState(RequestState.Failure);
          return throwError(() => new Error(result.error.message));
        }
      }),
      retry(2)
    );
  }

  deleteCollection(collection: Collection) {
    this.setRequestState(RequestState.InProgress);

    return from(
      this.supabase.client
        .from('collections')
        .delete()
        .eq('id', collection.id)
    ).pipe(
      switchMap(result => {
        if (!result.error) {
          this.removeCollectionFromState(collection);

          this.setRequestState(RequestState.Success);
          return this.getCollections();
        } else {
          this.setRequestState(RequestState.Failure);
          return throwError(() => new Error(result.error.message))
        }
      }),
      retry(2)
    );
  }

  addCardsToCollection(collection: Collection, cards: Card[]) {
    this.setRequestState(RequestState.InProgress);

    const idsToAdd = cards
      .map(card => card.id)
      .filter(id => !collection.cardIDs.includes(id));

    const appendedIDs = [...idsToAdd, ...collection.cardIDs];

    return from(
      this.supabase.client
        .from('collections')
        .update({ card_ids: appendedIDs })
        .eq('id', collection.id)
        .select()
        .returns<Tables<'collections'>[]>()
    ).pipe(
      switchMap(result => {
        if (result.data && !result.error) {
          const updatedCollection = new Collection(result.data[0]);

          //TODO: Change function name to suit pushing both new and updated collection objects
          this.setCollectionInState(updatedCollection);
          this.setRequestState(RequestState.Success);

          return this.getCollections();
        } else {
          this.setRequestState(RequestState.Failure);
          return throwError(() => new Error(result.error.message));
        }
      }),
      retry(2)
    );
  }

  removeCardsFromCollection(collection: Collection, cards: Card[]) {
    this.setRequestState(RequestState.InProgress);

    const idsToRemove = cards.map(card => card.id);
    const filteredIDs = collection.cardIDs.filter(
      id => !idsToRemove.includes(id)
    );

    return from(
      this.supabase.client
        .from('collections')
        .update({ card_ids: filteredIDs })
        .eq('id', collection.id)
        .select()
        .returns<Tables<'collections'>[]>()
    ).pipe(
      switchMap(result => {
        if (result.data && !result.error) {
          const updatedCollection = new Collection(result.data[0]);

          this.setCollectionInState(updatedCollection);
          this.setRequestState(RequestState.Success);

          return this.getCollections();
        } else {
          this.setRequestState(RequestState.Failure);
          return throwError(() => new Error(result.error.message));
        }
      }),
      retry(2)
    );
  }

  clearFetchedCollections() {
    this.collections.next(new Map<number, Collection>());
    this.setRequestState(RequestState.Initial);
  }

  selectCollection(collection: Collection) {
    this.selectedCollection.next(collection.id);
  }

  clearSelectedCollection() {
    this.selectedCollection.next(null);
  }

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
}
