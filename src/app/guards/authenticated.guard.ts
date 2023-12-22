import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {SupabaseAuthService} from "../services/supabase/supabase-auth.service";

export const authenticatedGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(SupabaseAuthService);

  const session = await authService.getSession();
  return session ? true : router.parseUrl('/auth/signin');
};
