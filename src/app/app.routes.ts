import {Routes} from '@angular/router';
import {collectionDetailGuard} from "./guards/collection-detail.guard";
import {authenticatedGuard} from "./guards/authenticated.guard";
import {cubeDetailGuard} from "./guards/cube-detail.guard";
import {unauthenticatedGuard} from "./guards/unauthenticated.guard";
import {donationDetailGuard} from "./guards/donation-detail.guard";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cube'
  },
  {
    path: 'auth',
    canActivate: [unauthenticatedGuard],
    children: [
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
      },
      {
        path: 'signin',
        loadComponent: () => import('./components/auth/signin/signin.component').then(
          m => m.SigninComponent
        )
      },
      {
        path: 'signup',
        loadComponent: () => import('./components/auth/signup/signup.component').then(
          m => m.SignupComponent
        )
      }
    ]
  },
  {
    path: 'browse',
    loadComponent: () => import('./components/browser/browser.component').then(
      m => m.BrowserComponent
    )
  },
  {
    path: 'collection',
    canActivate: [authenticatedGuard],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => import('./components/collections/collection-grid/collection-grid.component').then(
          m => m.CollectionGridComponent
        )
      },
      {
        path: 'detail',
        canActivate: [collectionDetailGuard],
        loadComponent: () => import('./components/collections/collection/collection.component').then(
          m => m.CollectionComponent
        )
      }
    ]
  },
  {
    path: 'cube',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => import('./components/cubes/cube-grid/cube-grid.component').then(
          m => m.CubeGridComponent
        )
      },
      {
        path: 'detail',
        canActivate: [cubeDetailGuard],
        loadComponent: () => import('./components/cubes/cube/cube.component').then(
          m => m.CubeComponent
        )
      }
    ]
  },
  {
    path: 'donation',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => import('./components/donations/donation-grid/donation-grid.component').then(
          m => m.DonationGridComponent
        )
      },
      {
        path: 'detail',
        canActivate: [donationDetailGuard],
        loadComponent: () => import('./components/donations/donation/donation.component').then(
          m => m.DonationComponent
        )
      }
    ]
  }
];
