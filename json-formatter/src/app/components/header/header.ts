import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ThemeToggle],
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <img src="/JsonFormatterIcon2.png" alt="JSON Formatter Logo" class="logo-image">
          <h1>{{ title }}</h1>
        </div>
        <div class="header-actions">
          <app-theme-toggle></app-theme-toggle>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background-color: var(--header-bg);
      color: var(--header-text);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-image {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      color: var(--header-text);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  `]
})
export class Header {
  @Input() title = 'JSON Formatter';
}
