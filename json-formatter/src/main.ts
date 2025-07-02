import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

// Initialize the application
bootstrapApplication(App, appConfig)
  .then(appRef => {
    // Get the router instance
    const router = appRef.injector.get(Router);

    // Track page views
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Send page view to Google Analytics
      if (typeof gtag === 'function') {
        gtag('config', 'G-R97PR681H0', {
          'page_path': event.urlAfterRedirects
        });
      }
    });
  })
  .catch(err => console.error(err));
