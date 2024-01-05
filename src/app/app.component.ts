import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {MenuItem, PrimeNGConfig} from "primeng/api";
import {MenubarModule} from "primeng/menubar";
import {ThemeToggleComponent} from "./components/theme-toggle/theme-toggle.component";
import {ToastModule} from "primeng/toast";
import {SupabaseAuthService} from "./services/supabase/supabase-auth.service";
import {CollectionsService} from "./services/collections.service";
import {ScrollTopModule} from "primeng/scrolltop";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {filter} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenubarModule, ThemeToggleComponent, ToastModule, ScrollTopModule, BreadcrumbModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private primengConfig = inject(PrimeNGConfig);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(SupabaseAuthService);
  private readonly collectionsService = inject(CollectionsService);

  title = 'cubetribution';
  readonly home = {icon: 'pi pi-home', routerLink: '/browser'}

  private readonly authenticatedItems = [
    {
      label: 'Stats',
      routerLink: '/stats'
    },
    {
      label: 'Browser',
      routerLink: '/browser',
    },
    {
      label: 'Cubes',
      routerLink: '/cubes/list'
    },
    {
      label: 'Collections',
      routerLink: '/collections/list'
    },
    {
      label: 'Donations',
      routerLink: '/donations/list'
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
      routerLink: '/cubes/list'
    },
    {
      label: 'Sign In',
      icon: 'pi pi-user',
      routerLink: '/auth/signin'
    }
  ];

  menuItems: MenuItem[];
  breadcrumbItems: MenuItem[] = [];

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      let newURL = url; // Store the current URL to avoid mutating it directly

      if (routeURL !== '') {
        newURL += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label != null) {
        breadcrumbs.push({ label, routerLink: newURL });
      }

      // Recursively call createBreadcrumbs for each child route
      this.createBreadcrumbs(child, newURL, breadcrumbs);
    }

    return breadcrumbs; // Return the final breadcrumb array after iterating through all children
  }

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.authService.authChanges((event, session) => {
      this.menuItems = session ? this.authenticatedItems : this.unauthenticatedItems;
      if (!session) {
        this.collectionsService.clearFetchedCollections();
      }
    });
  }

  constructor() {
    this.menuItems = this.unauthenticatedItems;

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.breadcrumbItems = this.createBreadcrumbs(this.activatedRoute.root));
  }
}
