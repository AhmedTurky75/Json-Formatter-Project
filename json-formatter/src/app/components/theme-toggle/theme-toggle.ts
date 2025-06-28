import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.scss']
})
export class ThemeToggle {
  private themeService = inject(ThemeService);
  
  // Current theme state
  isDark = computed(() => this.themeService.currentThemePreference === 'dark');

  toggleTheme() {
    this.themeService.toggleTheme();
  }
  
  get currentIcon() {
    return this.isDark() ? 'light_mode' : 'dark_mode';
  }
  
  get tooltipText() {
    return `Switch to ${this.isDark() ? 'Light' : 'Dark'} Mode`;
  }
}
