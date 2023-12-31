import {inject, Injectable} from '@angular/core';
import {SupabaseDatabaseService} from "./supabase/supabase-database.service";
import {BehaviorSubject, map} from "rxjs";
import {Collection} from "../models/collection";
import {Card} from "../models/card";

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  private readonly databaseService = inject(SupabaseDatabaseService);

  private collections = new BehaviorSubject<Map<number, Collection> | null>(null);
  collections$ = this.collections.asObservable()
    .pipe(
      map(collectionMap => {
        return collectionMap
          ? Array.from(collectionMap.values())
          : null
      })
    );

  private selectedCollection = new BehaviorSubject<Collection | null>(null);
  selectedCollection$ = this.selectedCollection.asObservable();

  //TODO: Rewrite the code for flipping the subject value into something more elegant
  private requestInProgress = new BehaviorSubject<boolean>(false);
  requestInProgress$ = this.requestInProgress.asObservable();

  async initializeCollections() {
    const collectionsValue = this.collections.getValue();

    if (!collectionsValue || !collectionsValue.size) {
      await this.getCollections();
    }
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

  private emitSelectedCollectionIfMatches(collection: Collection) {
    const selectedCollection = this.selectedCollection.getValue();

    if (selectedCollection && selectedCollection.id === collection.id) {
      this.selectedCollection.next(collection);
    }
  }

  selectCollection(collection: Collection) {
    this.selectedCollection.next(collection);
  }

  clearSelectedCollection() {
    this.selectedCollection.next(null);
  }
}
