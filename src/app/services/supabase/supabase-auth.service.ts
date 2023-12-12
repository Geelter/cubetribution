import {inject, Injectable} from '@angular/core';
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {SupabaseClientService} from "./supabase-client.service";
import {AuthChangeEvent, Session} from "@supabase/supabase-js";

@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthService {
  private readonly supabase = inject(SupabaseClientService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  async signInWithEmail(email: string, password: string) {
    const { data, error } =
      await this.supabase.client.auth.signInWithPassword({ email: email, password: password});

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'SignIn attempt failed',
        detail: error.message
      });
      return;
    }

    this.router.navigate(['/browse']);
  }

  async signUpWithEmail(username: string, email: string, password: string) {
    const { data, error } =
      await this.supabase.client.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username
          }
        }
      });

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'SignUp attempt failed',
        detail: error.message
      });
      return;
    }

    this.router.navigate(['/browse']);
  }

  async signOut() {
    const { error } = await this.supabase.client.auth.signOut();

    if (error) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'SignOut failed',
        detail: error.message
      });
      return;
    }

    this.router.navigate(['/signin']);
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.client.auth.onAuthStateChange(callback);
  }
}
