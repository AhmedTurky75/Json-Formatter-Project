import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatIconModule, 
    MatTooltipModule, 
    MatButtonModule
  ],
  template: `
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>JSON Formatter</h3>
            <p>Free online JSON formatter, validator, and more. Format, validate, and convert your JSON data with ease.</p>
          </div>
          
          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a routerLink="/formatter">Formatter</a></li>
              <li><a routerLink="/faq">FAQ</a></li>
              <li><a routerLink="/changelog">Changelog</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Tools</h4>
            <ul>
              <li>JSON Validator</li>
              <li>JSON to XML</li>
              <li>JSON to YAML</li>
              <li>JSON to CSV</li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} JSON Formatter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: linear-gradient(135deg, #0f172a 0%, #0a1122 100%);
      color: rgba(255, 255, 255, 0.9);
      padding: 3rem 0 1.5rem;
      margin-top: 3rem;
      font-size: 0.9rem;
      position: relative;
      z-index: 10;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .dark .app-footer {
      background: linear-gradient(135deg, #0a1122 0%, #070a15 100%);
      color: rgba(255, 255, 255, 0.9);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section {
      h3, h4 {
        color: #e2e8f0;
        margin-top: 0;
        margin-bottom: 1.2rem;
        font-size: 1.1rem;
        font-weight: 500;
        letter-spacing: 0.3px;
      }

      p {
        margin: 0.5rem 0 0;
        line-height: 1.6;
        color: rgba(226, 232, 240, 0.7);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 0.5rem;
          
          a, span {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.2s;
            cursor: pointer;

            &:hover {
              color: var(--primary-color, #3f51b5);
            }
          }
        }
      }
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;

      a {
        color: var(--text-secondary);
        transition: color 0.2s;

        &:hover {
          color: var(--primary-color, #3f51b5);
        }
      }
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
      margin-top: 1.5rem;

      p {
        margin: 0;
        color: rgba(226, 232, 240, 0.6);
        font-size: 0.85rem;
        font-weight: 400;
      }
    }

    .footer-links {
      display: flex;
      gap: 1rem;
      align-items: center;

      .divider {
        color: rgba(255, 255, 255, 0.4);
      }

      a {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        transition: all 0.2s ease;
        font-size: 0.85rem;

        &:hover {
          color: #ffffff;
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 480px) {
      .footer-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }
}
