import { Injectable, computed, signal, effect } from '@angular/core';

type Theme = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'json-formatter-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme = signal<Theme>('system');
  private systemDark: MediaQueryList | null = null;
  private systemThemeListener: ((e: MediaQueryListEvent) => void) | null = null;
  
  // Computed theme based on user preference and system settings
  currentTheme = computed<Exclude<Theme, 'system'>>(() => {
    const theme = this.theme();
    if (theme !== 'system') {
      return theme;
    }
    return this.systemDark?.matches ? 'dark' : 'light';
  });

  // Public method to get current theme mode (light/dark)
  get currentMode(): 'light' | 'dark' {
    return this.currentTheme();
  }

  // Public method to get current theme preference
  get currentThemePreference(): Theme {
    return this.theme();
  }

  constructor() {
    // Initialize in the initialize() method to handle SSR
  }

  /**
   * Initialize the theme service
   * Should be called in the app component's ngOnInit
   */
  initialize(): void {
    if (typeof window === 'undefined') return;
    
    // Initialize system dark mode detection
    this.systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (savedTheme) {
      this.theme.set(savedTheme);
    }

    // Set up system theme change listener
    this.systemThemeListener = (e: MediaQueryListEvent) => {
      if (this.theme() === 'system') {
        this.updateDocumentClasses(e.matches ? 'dark' : 'light');
      }
    };
    
    this.systemDark.addEventListener('change', this.systemThemeListener);

    // Update document class when theme changes
    effect(() => {
      const theme = this.currentTheme();
      this.updateDocumentClasses(theme);
    });
  }

  /**
   * Clean up event listeners when service is destroyed
   */
  destroy(): void {
    if (this.systemDark && this.systemThemeListener) {
      this.systemDark.removeEventListener('change', this.systemThemeListener);
      this.systemThemeListener = null;
    }
  }

  /**
   * Set the current theme
   * @param theme The theme to set (light, dark, or system)
   */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  /**
   * Toggle between light and dark themes
   * If current theme is 'system', it will be set to the opposite of the current system theme
   */
  toggleTheme(): void {
    const current = this.theme();
    if (current === 'system') {
      // Toggle between light and dark based on system preference
      const newTheme = this.systemDark?.matches ? 'light' : 'dark';
      this.setTheme(newTheme);
    } else {
      // Toggle between light and dark
      this.setTheme(current === 'dark' ? 'light' : 'dark');
    }
  }

  /**
   * Update the document's class list based on the current theme
   * @param theme The theme to apply (light or dark)
   */
  private updateDocumentClasses(theme: 'light' | 'dark'): void {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
}
