import { Routes } from '@angular/router';
import {CollectionGridComponent} from "./components/collections/collection-grid/collection-grid.component";
import {BrowserComponent} from "./components/browser/browser.component";
import {SigninComponent} from "./components/auth/signin/signin.component";
import {SignupComponent} from "./components/auth/signup/signup.component";

export const routes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'collections',
    component: CollectionGridComponent,
  },
  {
    path: 'browse',
    component: BrowserComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'collections'
  }
];
