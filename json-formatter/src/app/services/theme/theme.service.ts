import { Injectable, computed, signal, effect, inject, runInInjectionContext, Injector } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';

type Theme = 'light' | 'dark' | 'system';
type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private injector = inject(Injector);
  
  // Signal to track the current theme preference
  private themePreference = signal<Theme>('dark');
  
  // Signal to track the current actual theme mode (light/dark)
  private currentMode = signal<ThemeMode>('light');
  
  // Subject to notify about theme mode changes
  private modeChangedSubject = new BehaviorSubject<boolean>(false);
  
  // Public observable for mode changes
  public currentModeChanged: Observable<boolean> = this.modeChangedSubject.asObservable();
  
  // Public getter for current theme preference
  public get currentThemePreference(): Theme {
    return this.themePreference();
  }
  
  // Public getter for current mode
  public get currentModeSignal() {
    return this.currentMode.asReadonly();
  }
  
  private themeEffect = effect(() => {
    const theme = this.themePreference();
    const prefersDark = typeof window !== 'undefined' ? 
      window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    
    // Save preference to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    
    // Determine the actual theme to apply
    const mode = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
    this.currentMode.set(mode);
    this.modeChangedSubject.next(mode === 'dark');
    
    // Apply the theme to the document
    if (typeof document !== 'undefined') {
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
  
  constructor() {
    // Run the effect in the injection context
    runInInjectionContext(this.injector, () => {
      // This ensures the effect runs in the correct context
    });
    
    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeMedia.addEventListener('change', () => {
        if (this.themePreference() === 'system') {
          const prefersDark = darkModeMedia.matches;
          const newMode = prefersDark ? 'dark' : 'light';
          this.currentMode.set(newMode);
          this.modeChangedSubject.next(newMode === 'dark');
        }
      });
    }
  }
  
  /**
   * Initialize the theme service
   */
  initialize(): void {
    if (typeof window === 'undefined') return;
    
    // Get saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set the initial theme
    this.themePreference.set(savedTheme || 'system');
    this.currentMode.set(savedTheme === 'dark' || (savedTheme === 'system' && prefersDark) ? 'dark' : 'light');
  }
  
  /**
   * Set the theme preference
   * @param theme The theme to set ('light', 'dark', or 'system')
   */
  setTheme(theme: Theme): void {
    this.themePreference.set(theme);
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const current = this.themePreference();
    if (current === 'system') {
      this.themePreference.set('dark');
    } else if (current === 'dark') {
      this.themePreference.set('light');
    } else {
      this.themePreference.set('dark');
    }
  }
  
  /**
   * Check if dark mode is active
   */
  isDarkMode(): boolean {
    return this.currentMode() === 'dark';
  }
  
  /**
   * Get the current theme mode (light/dark)
   */
  getCurrentMode(): ThemeMode {
    return this.currentMode();
  }
}
