import {inject, Injectable} from '@angular/core';
import {SupabaseClientService} from "./supabase-client.service";
import {Card} from "../../models/card";
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class SupabaseDatabaseService {
  private readonly supabase = inject(SupabaseClientService);
  private readonly messageService = inject(MessageService);

  async createCollection(name: string, cards: Card[] | null = null) {
    let body: any = {};

    body.name = name;
    if (cards) {
      body.card_ids = cards.map(card => card.id);
    }

    const { data, error } = await this.supabase.client
      .from('collections')
      .insert(body)
      .select();

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Creating collection failed',
        detail: error.message
      });
    }

    return data;
  }

  async fetchCollections() {
    const { data, error } = await this.supabase.client
      .from('collections')
      .select();

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Fetching collections failed',
        detail: error.message
      });
      return;
    }

    return data;
  }
}
