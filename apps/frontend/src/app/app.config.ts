import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { provideStore } from '@ngrx/store';
import { sesionReducer } from './ngrx/auth/auth.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    importProvidersFrom(NgbModalModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore({ sesion: sesionReducer })
  ]
};
