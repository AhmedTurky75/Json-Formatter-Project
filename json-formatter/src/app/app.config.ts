import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { environment } from '../environments/environment';
import { AnalyticsService } from './services/analytics.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ 
      eventCoalescing: true,
      runCoalescing: true
    }),
    provideAnalytics(() => getAnalytics()),
    {
      provide: AnalyticsService,
      useFactory: () => {
        if (environment.production) {
          return new AnalyticsService();
        }
        // Return a mock service in development that does nothing
        return {
          trackEvent: (eventName: string, eventParams: any) => {
            // No-op in development
          },
          sendPageView: (url: string) => {
            // No-op in development
          }
        };
      }
    },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
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
