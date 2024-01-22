import {Routes} from '@angular/router';
import {collectionDetailGuard} from "./guards/collection-detail.guard";
import {authenticatedGuard} from "./guards/authenticated.guard";
import {cubeDetailGuard} from "./guards/cube-detail.guard";
import {unauthenticatedGuard} from "./guards/unauthenticated.guard";
import {donationDetailGuard} from "./guards/donation-detail.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'browser',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [unauthenticatedGuard],
    data: {
      title: 'Authentication',
      breadcrumb: 'Authentication'
    },
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
        ),
        data: {
          title: 'Sign In',
          breadcrumb: 'Sign In'
        }
      },
      {
        path: 'signup',
        loadComponent: () => import('./components/auth/signup/signup.component').then(
          m => m.SignupComponent
        ),
        data: {
          title: 'Sign Up',
          breadcrumb: 'Sign Up'
        }
      }
    ]
  },
  {
    path: 'stats',
    loadComponent: () => import('./components/stats/dashboard/dashboard.component').then(
      m => m.DashboardComponent
    ),
    data: {
      title: 'Stats',
      breadcrumb: 'Stats'
    }
  },
  {
    path: 'browser',
    loadComponent: () => import('./components/browser/browser.component').then(
      m => m.BrowserComponent
    ),
    data: {
      title: 'Card Browser',
      breadcrumb: 'Browser'
    }
  },
  {
    path: 'cubes',
    data: {
      breadcrumb: 'Cubes'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        data: {
          title: 'Cubes List',
          breadcrumb: 'List'
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./components/cubes/cube-grid/cube-grid.component').then(
              m => m.CubeGridComponent
            ),
            data: {
              breadcrumb: null
            }
          },
          {
            path: 'detail',
            canActivate: [cubeDetailGuard],
            data: {
              title: 'Cube Detail',
              breadcrumb: 'Detail'
            },
            loadComponent: () => import('./components/cubes/cube/cube.component').then(
              m => m.CubeComponent
            )
          }
        ]
      }
    ],
  },
  {
    path: 'collections',
    canActivate: [authenticatedGuard],
    data: {
      breadcrumb: 'Collections'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        data: {
          title: 'Collections List',
          breadcrumb: 'List'
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./components/collections/collection-grid/collection-grid.component').then(
              m => m.CollectionGridComponent
            ),
            data: {
              breadcrumb: null
            }
          },
          {
            path: 'detail',
            canActivate: [collectionDetailGuard],
            data: {
              title: 'Collection Detail',
              breadcrumb: 'Detail'
            },
            loadComponent: () => import('./components/collections/collection/collection.component').then(
              m => m.CollectionComponent
            )
          }
        ]
      }
    ],
  },
  {
    path: 'donations',
    canActivate: [authenticatedGuard],
    data: {
      breadcrumb: 'Donations'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        data: {
          title: 'Donations List',
          breadcrumb: 'List'
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./components/donations/donation-grid/donation-grid.component').then(
              m => m.DonationGridComponent
            ),
            data: {
              breadcrumb: null
            }
          },
          {
            path: 'detail',
            canActivate: [donationDetailGuard],
            data: {
              title: 'Donation Detail',
              breadcrumb: 'Detail'
            },
            loadComponent: () => import('./components/donations/donation/donation.component').then(
              m => m.DonationComponent
            )
          }
        ]
      }
    ],
  }
];
