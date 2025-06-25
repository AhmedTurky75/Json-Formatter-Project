import { Component, OnInit, inject, PLATFORM_ID, Inject, effect, runInInjectionContext, Injector } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeToggle } from './components/theme-toggle/theme-toggle';
import { ThemeService } from './services/theme';

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
  styleUrl: './app.scss'
})
export class App implements OnInit {
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
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.showWelcomeMessage();
    }
  }
  
  private initializeTheme(): void {
    // Ensure theme initialization happens in the correct context
    runInInjectionContext(this.injector, () => {
      this.themeService.initialize();
    });
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
