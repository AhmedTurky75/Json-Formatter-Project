import { Injectable, inject, isDevMode } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private router = inject(Router);
  private readonly measurementId = 'G-R97PR681H0'; // Your GA4 Measurement ID
  
  constructor() {
    if (environment.production) {
      this.initializeGoogleAnalytics();
      this.trackPageViews();
    } else if (isDevMode()) {
      console.log('[Analytics] Running in development mode - analytics will be mocked');
    }
  }

  private initializeGoogleAnalytics(): void {
    try {
      // The GA script is now loaded from index.html
      if (typeof window.gtag === 'function') {
    // Configure Google Analytics
        window.gtag('config', this.measurementId, {
          'send_page_view': false, // We handle page views manually
          'transport_type': 'beacon',
          'anonymize_ip': true
        });
      } else {
        console.error('Google Analytics gtag function not found');
      }
    } catch (error) {
      console.error('Error initializing Google Analytics:', error);
    }
  }

  private trackPageViews(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects) {
        this.sendPageView(event.urlAfterRedirects);
      }
    });
  }

  sendPageView(url: string): void {
    if (typeof window.gtag === 'function') {
      window.gtag('config', this.measurementId, {
        'page_path': url,
        'page_title': document.title
      });

      // Also send a page_view event
      this.trackEvent('page_view', {
        page_path: url,
        page_title: document.title
      });
    }
  }

  trackEvent(eventName: string, eventParams: Record<string, any> = {}): void {
    if (typeof window.gtag === 'function') {
      const gaEventParams: Record<string, any> = {
        ...eventParams,
        event_category: eventParams['category'] || 'engagement',
        event_label: eventParams['label'],
        value: eventParams['value']
      };

      // Remove undefined values
      Object.keys(gaEventParams).forEach(key => {
        if (gaEventParams[key] === undefined) {
          delete gaEventParams[key];
        }
      });

      window.gtag('event', eventName, gaEventParams);
    } else if (isDevMode()) {
      // Using console.info instead of console.log for better visibility in dev tools
      console.info(`[Analytics] Event: ${eventName}`, eventParams);
    }
  }
}
