import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, Inject, effect, runInInjectionContext, Injector } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeToggle } from './components/theme-toggle/theme-toggle';
import { Header } from './components/header/header';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ThemeService } from './services/theme';

// Import Prism.js
import 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

// Import Prism.js theme
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    ThemeToggle,
    Header,
    FooterComponent
  ],
  templateUrl: './app.html',
  styles: [`
    :host {
      --header-height: 64px;
      display: block;
      min-height: 100vh;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-header-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .content-wrapper {
      flex: 1;
      margin-top: var(--header-height);
      min-height: calc(100vh - var(--header-height));
      display: flex;
      flex-direction: column;
    }

    .app-main {
      flex: 1;
      padding: 1rem;
    }

    .container {
      margin: 0 auto;
      width: 100%;
      padding: 0 1rem;
    }
  `]
})
export class App implements OnInit, OnDestroy {
  private prismLoaded = false;
  title = 'Lite JSON Formatter';
  currentYear: number;
  private readonly themeService = inject(ThemeService);
  private readonly snackBar = inject(MatSnackBar);
  private injector = inject(Injector);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private meta = inject(Meta);
  private titleService = inject(Title);
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.currentYear = new Date().getFullYear();
    
    // Initialize theme in the constructor to ensure it runs in the correct context
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
      this.initializePrism();
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Set up route change subscription for SEO updates
      this.setupRouteChangeHandling();
      
      // Subscribe to theme changes
      runInInjectionContext(this.injector, () => {
        effect(() => {
          // Theme class is already handled by ThemeService, just update the code highlighting
          if (this.prismLoaded) {
            setTimeout(() => this.highlightAllCode(), 100);
          }
        });
      });
      
      // Initial highlight
      if (this.prismLoaded) {
        setTimeout(() => this.highlightAllCode(), 100);
      }
    }
  }

  private setupRouteChangeHandling(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe((data: any) => {
      // Update page title
      const title = data['title'] || 'Lite JSON Formatter - Format, Validate & Convert JSON Online';
      this.titleService.setTitle(title);
      
      // Update meta tags
      const description = data['description'] || 'Free online JSON formatter, validator, and converter. Beautify, minify, and convert JSON with our easy-to-use tool.';
      const keywords = data['keywords'] || 'JSON formatter, JSON validator, JSON to XML, JSON to YAML, JSON to CSV, format JSON, minify JSON, online JSON tool';
      
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ name: 'keywords', content: keywords });
      
      // Update Open Graph tags
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ property: 'og:url', content: window.location.href });
      
      // Update Twitter Card tags
      this.meta.updateTag({ name: 'twitter:title', content: title });
      this.meta.updateTag({ name: 'twitter:description', content: description });
      
      // Handle 404 redirects
      if (data['notFound']) {
        // Optionally show a 404 message or redirect to a dedicated 404 page
        this.snackBar.open('Page not found. Redirected to homepage.', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  private initializeTheme(): void {
    // Ensure theme initialization happens in the correct context
    runInInjectionContext(this.injector, () => {
      this.themeService.initialize();
    });
  }

  private initializePrism() {
    if (isPlatformBrowser(this.platformId) && typeof (window as any).Prism !== 'undefined') {
      this.prismLoaded = true;
      // Add line numbers to all pre elements
      document.querySelectorAll('pre').forEach(el => {
        el.classList.add('line-numbers');
      });
      // Initial highlight
      setTimeout(() => this.highlightAllCode(), 100);
    } else {
      console.warn('Prism.js not loaded');
    }
  }

  private highlightAllCode() {
    if (isPlatformBrowser(this.platformId) && typeof (window as any).Prism !== 'undefined') {
      (window as any).Prism.highlightAll();
    }
  }

  ngOnDestroy() {
    // Clean up if needed
  }

  private showWelcomeMessage(): void {
    // Only show welcome message on initial load
    if (!sessionStorage.getItem('welcomeShown')) {
      this.snackBar.open('Welcome to JSON Formatter!', 'Dismiss', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['welcome-snackbar']
      });
      
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }
}
