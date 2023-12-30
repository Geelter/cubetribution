import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MenuItem, PrimeNGConfig} from "primeng/api";
import {MenubarModule} from "primeng/menubar";
import {ThemeToggleComponent} from "./components/theme-toggle/theme-toggle.component";
import {ToastModule} from "primeng/toast";
import {SupabaseAuthService} from "./services/supabase/supabase-auth.service";
import {CollectionsService} from "./services/collections.service";
import {ScrollTopModule} from "primeng/scrolltop";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenubarModule, ThemeToggleComponent, ToastModule, ScrollTopModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  primengConfig = inject(PrimeNGConfig);
  authService = inject(SupabaseAuthService);
  collectionsService = inject(CollectionsService);

  title = 'cubetribution';

  private readonly authenticatedItems = [
    {
      label: 'Stats',
      routerLink: '/stats'
    },
    {
      label: 'Browse',
      routerLink: '/browse',
    },
    {
      label: 'Cubes',
      routerLink: '/cube/list'
    },
    {
      label: 'Collections',
      routerLink: '/collection/list'
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-power-off',
      command: () => {
        this.authService.signOut();
      }
    }
  ];

  private readonly unauthenticatedItems = [
    {
      label: 'Stats',
      routerLink: '/stats'
    },
    {
      label: 'Cubes',
      routerLink: '/cube/list'
    },
    {
      label: 'Sign In',
      icon: 'pi pi-user',
      routerLink: '/auth/signin'
    }
  ];

  menuItems: MenuItem[];

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.authService.authChanges((event, session) => {
      this.menuItems = session ? this.authenticatedItems : this.unauthenticatedItems;
      if (!session) {
        this.collectionsService.clearFetchedCollections();
      }
    })
  }

  constructor() {
    this.menuItems = this.unauthenticatedItems;
  }
}
