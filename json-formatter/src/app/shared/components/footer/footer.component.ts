import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="container">
        <p class="footer-text">&copy; {{ currentYear }} JSON Formatter. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: var(--color-surface);
      color: var(--text-secondary);
      padding: 1rem 0;
      border-top: 1px solid var(--border-color);
      margin-top: auto;
      font-size: 0.875rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .footer-text {
      margin: 0;
      text-align: center;
      opacity: 0.8;
    }
  `]
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }
}
