import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

declare const gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private router = inject(Router);
  
  constructor() {
    // Only initialize in production
    if (environment.production) {
      this.initializeGoogleAnalytics();
      this.trackPageViews();
    }
  }

  private initializeGoogleAnalytics(): void {
    // Add the Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.firebase.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    
    // Configure Google Analytics
    gtag('config', environment.firebase.measurementId, {
      'send_page_view': false, // We'll handle page views manually
      'transport_type': 'beacon',
      'anonymize_ip': true
    });
    
    // Make gtag available globally
    (window as any).gtag = gtag;
  }

  private trackPageViews(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.urlAfterRedirects) {
        this.sendPageView(event.urlAfterRedirects);
      }
    });
  }

  sendPageView(url: string): void {
    if (typeof gtag === 'function') {
      gtag('config', environment.firebase.measurementId, {
        'page_path': url,
        'page_title': document.title
      });
    }
  }

  // Track events
  trackEvent(eventName: string, eventParams: any = {}): void {
    if (typeof gtag === 'function') {
      gtag('event', eventName, {
        ...eventParams,
        'event_category': eventParams.category || 'engagement',
        'event_label': eventParams.label,
        'value': eventParams.value
      });
    }
  }
}
