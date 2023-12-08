import { Routes } from '@angular/router';
import {CollectionGridComponent} from "./collection-grid/collection-grid.component";
import {BrowserComponent} from "./browser/browser.component";

export const routes: Routes = [
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
