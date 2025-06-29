import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ 
      eventCoalescing: true,
      runCoalescing: true
    }),
    provideHttpClient(
      withInterceptorsFromDi(),
      withJsonpSupport()
    ),
    provideRouter(routes),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
    provideAnimations(),
    // Providers for SEO
    { provide: 'isServer', useValue: false },
    { provide: 'isBrowser', useValue: true },
    { provide: 'isDevMode', useFactory: () => false, deps: [] },
    { provide: 'APP_BASE_HREF', useValue: '/' }
  ]
};
