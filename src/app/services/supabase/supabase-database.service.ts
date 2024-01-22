import {inject, Injectable} from '@angular/core';
import {SupabaseClientService} from "./supabase-client.service";
import {MessageService} from "primeng/api";
import {Tables} from "../../models/supabase";

@Injectable({
  providedIn: 'root'
})
export class SupabaseDatabaseService {
  private readonly supabase = inject(SupabaseClientService);
  private readonly messageService = inject(MessageService);

  // Drafts
  private async fetchDrafts() {
    const { data, error } = await this.supabase.client
      .from('drafts')
      .select()
      .returns<Tables<'drafts'>[]>();

    return data;
  }

  // Players
  private async fetchPlayers() {
    const { data, error } = await this.supabase.client
      .from('players')
      .select()
      .returns<Tables<'players'>[]>();

    return data;
  }

  // Scores
  private async fetchScores() {
    const { data, error } = await this.supabase.client
      .from('scores')
      .select()
      .returns<Tables<'scores'>[]>();


    return data;
  }

  async fetchDashboardData() {
    const drafts = await this.fetchDrafts();
    const players = await this.fetchPlayers();
    const scores = await this.fetchScores();

    if (!drafts || !players || !scores) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Fetching dashboard data failed',
      });
    } else {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Dashboard data fetched'
      });
    }

    return {
      drafts: drafts,
      players: players,
      scores: scores
    }
  }
}
