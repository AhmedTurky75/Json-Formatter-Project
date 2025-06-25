import { Component, OnInit, inject, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription } from 'rxjs';

type Theme = 'light' | 'dark' | 'system';

interface ThemeOption {
  value: Theme;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.scss']
})
export class ThemeToggle implements OnInit {
  private themeService = inject(ThemeService);
  
  // Theme options
  themeOptions: ThemeOption[] = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'system', label: 'System', icon: 'computer' }
  ];

  // Current theme state
  currentTheme = signal<Theme>('system');
  isDark = signal(false);
  currentIcon = signal('contrast');
  
  // Subscription for theme changes
  private themeSub?: Subscription;

  // Effect to update the icon when theme changes
  private themeEffect = effect(() => {
    const theme = this.currentTheme();
    const option = this.themeOptions.find(t => t.value === theme);
    this.currentIcon.set(option?.icon || 'contrast');
  });

  ngOnInit() {
    // Initialize the theme service
    this.themeService.initialize();
    
    // Set initial theme state
    this.currentTheme.set(this.themeService.currentThemePreference);
    this.isDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Subscribe to theme changes
    const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      this.isDark.set(e.matches);
    };
    
    // Add event listener for system theme changes
    darkModeMedia.addEventListener('change', handleColorSchemeChange);
    
    // Store the event listener for cleanup
    this.themeSub = new Subscription(() => {
      darkModeMedia.removeEventListener('change', handleColorSchemeChange);
    });
  }
  
  ngOnDestroy() {
    // Clean up subscription
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
    this.currentTheme.set(theme);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    // Update current theme after toggle
    const nextTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.currentTheme.set(nextTheme);
  }
}
