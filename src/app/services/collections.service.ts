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

  async initializeCollections() {
    const collectionsValue = this.collections.getValue();

    if (!collectionsValue || !collectionsValue.size) {
      await this.getCollections();
    }
  }

  async getCollections() {
    const collections = await this.databaseService.fetchCollections();

    if (collections) {
      this.collections.next(collections);
    }
  }

  clearFetchedCollections() {
    this.collections.next(null);
  }
}
