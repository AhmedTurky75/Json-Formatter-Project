import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, Inject, effect, runInInjectionContext, Injector } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeToggle } from './components/theme-toggle/theme-toggle';
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
    ThemeToggle
  ],
  templateUrl: './app.html',
  styles: [`
    /* Enhanced styles for code blocks */
    pre[class*="language-"] {
      margin: 0;
      border-radius: 0;
      overflow: auto;
      background: transparent !important;
      position: relative;
    }
    
    /* Line numbers styling */
    pre.line-numbers {
      position: relative;
      padding-left: 3.8em;
      counter-reset: linenumber;
    }
    
    pre.line-numbers > code {
      position: relative;
      white-space: inherit;
    }
    
    .line-numbers .line-numbers-rows {
      position: absolute;
      pointer-events: none;
      top: 0;
      font-size: 100%;
      left: -3.8em;
      width: 3em; /* Works for line-numbers below 1000 lines */
      letter-spacing: -1px;
      border-right: 1px solid #999;
      user-select: none;
    }
    
    .line-numbers-rows > span {
      display: block;
      counter-increment: linenumber;
    }
    
    .line-numbers-rows > span:before {
      content: counter(linenumber);
      color: #999;
      display: block;
      padding-right: 0.8em;
      text-align: right;
    }
  `]
})
export class App implements OnInit, OnDestroy {
  private prismLoaded = false;
  title = 'JSON Formatter';
  currentYear: number;
  private readonly themeService = inject(ThemeService);
  private readonly snackBar = inject(MatSnackBar);
  private injector = inject(Injector);
  
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
      this.showWelcomeMessage();
      // Set initial theme - ThemeService already handles this in its constructor
      
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
