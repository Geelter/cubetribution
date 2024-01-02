import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {ConfirmationService, MessageService} from "primeng/api";
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    MessageService,
    ConfirmationService,
  ]
};

export const dialogBreakpoints = {
  '960px': '60vw',
  '800px': '70vw',
  '700px': '80vw',
  '600px': '95vw'
};

export const layoutOptions = [
  { icon: 'pi pi-th-large', layout: 'grid' },
  { icon: 'pi pi-bars', layout: 'table' }
];
