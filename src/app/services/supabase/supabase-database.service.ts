import {inject, Injectable} from '@angular/core';
import {SupabaseClientService} from "./supabase-client.service";
import {Card} from "../../models/card";
import {MessageService} from "primeng/api";
import {Collection} from "../../models/collection";
import {Tables} from "../../models/supabase";
import {Cube} from "../../models/cube";
import {Donation} from "../../models/donation";

@Injectable({
  providedIn: 'root'
})
export class SupabaseDatabaseService {
  private readonly supabase = inject(SupabaseClientService);
  private readonly messageService = inject(MessageService);

  // Collections
  async createCollection(name: string, cards: Card[] = []) {
    const cardIDs = cards.map(card => card.id);

    const { data, error } = await this.supabase.client
      .from('collections')
      .insert({ name: name, card_ids: cardIDs })
      .select()
      .returns<Tables<'collections'>>()
      .single();

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Creating collection failed',
        detail: error.message
      });
    } else {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Collection created'
      });
    }

    return data ? new Collection(data) : undefined;
  }

  async fetchCollections() {
    const { data, error } = await this.supabase.client
      .from('collections')
      .select()
      .returns<Tables<'collections'>[]>();

    const collections = data
      ? new Map(data.map(collection => [collection.id, new Collection(collection)]))
      : undefined;

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Fetching collections failed',
        detail: error.message
      });
      return;
    } else {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Collections fetched'
      })
    }

    return collections;
  }

  async deleteCollection(id: number) {
    const { error } = await this.supabase.client
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Deleting collection-card failed',
        detail: error.message
      });
    } else {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Collection deleted'
      })
    }

    return error;
  }

  async updateCollectionMeta(id: number, changes: any) {
    const { error } = await this.supabase.client
      .from('collections')
      .update(changes)
      .eq('id', id);

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Updating collection-card failed',
        detail: error.message
      });
    } else {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Collection updated'
      })
    }

    return error;
  }

  async updateCollectionCards(id: number, updatedIDs: string[]) {
    const { error } = await this.supabase.client
      .from('collections')
      .update({ card_ids: updatedIDs })
      .eq('id', id);

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Updating collection-card failed',
        detail: error.message
      });
    } else {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Collection updated'
      })
    }

    return error;
  }

  // Cubes
  async fetchCubes() {
    const { data, error } = await this.supabase.client
      .from('cubes')
      .select()
      .returns<Tables<'cubes'>[]>();

    const cubes = data?.map(cube => new Cube(cube));

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Fetching cubes failed',
        detail: error.message
      });
      return;
    } else {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Cubes fetched'
      })
    }

    return cubes;
  }

  // Donations
  async createDonationForCube(collection: Collection, cube: Cube) {
    const filteredCards = collection.cardIDs.filter(id => cube.cardIDs.includes(id));

    const { data, error } = await this.supabase.client
      .from('donations')
      .insert({ name: `${cube.name} donation`, cube_id: cube.id, card_ids: filteredCards })
      .select()
      .returns<Tables<'donations'>>()
      .single();

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Creating donation failed',
        detail: error.message
      });
    } else {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Donation created'
      });
    }

    return data ? new Donation(data) : undefined;
  }

  async deleteDonation(donation: Donation) {
    const { error } = await this.supabase.client
      .from('donations')
      .delete()
      .eq('id', donation.id);

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Deleting failed',
        detail: error.message
      });
    } else {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Donation deleted'
      });
    }

    return error;
  }

  async fetchDonations() {
    const { data, error } = await this.supabase.client
      .from('donations')
      .select()
      .returns<Tables<'donations'>[]>();

    const donations = data?.map(donation => new Donation(donation));

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Fetching donations failed',
        detail: error.message
      });
    } else {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Donations fetched'
      });
    }

    return donations;
  }
}
