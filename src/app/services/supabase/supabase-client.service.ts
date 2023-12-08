import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {Database} from "../../models/supabase";

const options = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
};

const supabaseUrl = 'https://cghhxihdzudgjomkomop.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnaGh4aWhkenVkZ2pvbWtvbW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyNTUyMDUsImV4cCI6MjAxNjgzMTIwNX0.KyJbFm3PiEElGo2zhZNApe4UsuBatazCeqEX4w3Fxdk';

@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  readonly client: SupabaseClient;

  constructor() {
    this.client = createClient<Database>(
      supabaseUrl,
      supabaseKey,
      options
    );
  }
}
