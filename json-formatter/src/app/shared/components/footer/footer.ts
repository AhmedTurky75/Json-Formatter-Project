import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

interface FooterLink {
  title: string;
  path: string;
  icon?: string;
  external?: boolean;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule,
    RouterModule
  ],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <!-- Logo and Description -->
        <div class="footer-section about">
          <div class="footer-logo">
            <img src="assets/images/logo-icon.png" alt="JSON Formatter Logo" class="logo-image">
            <h3 class="logo-text">JSON Formatter</h3>
          </div>
          <p class="footer-description">
            A free online tool to format, validate, and beautify your JSON data. 
            No data is sent to our servers - everything happens in your browser.
          </p>
          <div class="social-links">
            <a href="https://github.com/yourusername/json-formatter" 
               target="_blank" 
               rel="noopener noreferrer"
               mat-icon-button
               matTooltip="GitHub">
              <mat-icon svgIcon="github"></mat-icon>
            </a>
            <a href="https://twitter.com/yourusername" 
               target="_blank" 
               rel="noopener noreferrer"
               mat-icon-button
               matTooltip="Twitter">
              <mat-icon svgIcon="twitter"></mat-icon>
            </a>
            <a href="https://linkedin.com/company/yourcompany" 
               target="_blank" 
               rel="noopener noreferrer"
               mat-icon-button
               matTooltip="LinkedIn">
              <mat-icon svgIcon="linkedin"></mat-icon>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section links">
          <h4 class="section-title">Quick Links</h4>
          <ul class="footer-links">
            <li *ngFor="let link of quickLinks">
              <a [routerLink]="[link.path]" 
                 [target]="link.external ? '_blank' : '_self'"
                 [rel]="link.external ? 'noopener noreferrer' : ''">
                <mat-icon *ngIf="link.icon" class="link-icon">{{link.icon}}</mat-icon>
                {{link.title}}
              </a>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div class="footer-section resources">
          <h4 class="section-title">Resources</h4>
          <ul class="footer-links">
            <li *ngFor="let resource of resources">
              <a [routerLink]="[resource.path]" 
                 [target]="resource.external ? '_blank' : '_self'"
                 [rel]="resource.external ? 'noopener noreferrer' : ''">
                <mat-icon *ngIf="resource.icon" class="link-icon">{{resource.icon}}</mat-icon>
                {{resource.title}}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-section contact">
          <h4 class="section-title">Contact Us</h4>
          <ul class="contact-info">
            <li>
              <mat-icon class="contact-icon">email</mat-icon>
            </li>
            <li>
              <mat-icon class="contact-icon">language</mat-icon>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">example.com</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{currentYear}} JSON Formatter. All rights reserved.
        </div>
        <div class="legal-links">
          <a [routerLink]="['/privacy-policy']">Privacy Policy</a>
          <span class="divider">•</span>
          <a [routerLink]="['/terms']">Terms of Service</a>
          <span class="divider">•</span>
          <a [routerLink]="['/cookies']">Cookie Policy</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: #f5f5f5;
      color: #333;
      padding: 3rem 1rem 1rem;
      margin-top: 3rem;
      border-top: 1px solid #e0e0e0;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 0 1rem;
    }

    .footer-section {
      margin-bottom: 1.5rem;
    }

    .footer-section .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      color: #333;
      position: relative;
      padding-bottom: 0.5rem;
    }

    .footer-section .section-title::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 2px;
      background-color: var(--primary-color);
    }


    .footer-logo {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }

    .footer-logo .logo-image {
      width: 28px;
      height: 28px;
      margin-right: 0.75rem;
    }

    .footer-logo .logo-text {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
    }

    .footer-description {
      font-size: 0.9rem;
      line-height: 1.6;
      color: #666;
      margin-bottom: 1.5rem;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
    }

    .social-links a {
      color: #666;
      transition: color 0.2s ease;
    }

    .social-links a:hover {
      color: var(--primary-color);
    }


    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.75rem;
    }

    .footer-links a {
      display: flex;
      align-items: center;
      color: #555;
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.2s ease, transform 0.2s ease;
    }

    .footer-links a:hover {
      color: var(--primary-color);
      transform: translateX(4px);
    }

    .footer-links a .link-icon {
      font-size: 1rem;
      margin-right: 0.5rem;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }


    .contact-info {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .contact-info li {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
      color: #555;
    }

    .contact-info .contact-icon {
      font-size: 1.1rem;
      margin-right: 0.75rem;
      color: var(--primary-color);
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .contact-info a {
      color: #555;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .contact-info a:hover {
      color: var(--primary-color);
      text-decoration: underline;
    }


    .footer-bottom {
      max-width: 1200px;
      margin: 3rem auto 0;
      padding: 1.5rem 1rem 0;
      border-top: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .footer-bottom {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }

    .copyright {
      font-size: 0.85rem;
      color: #666;
    }

    .legal-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.85rem;
    }

    @media (min-width: 768px) {
      .legal-links {
        justify-content: flex-end;
      }
    }

    .legal-links a {
      color: #555;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .legal-links a:hover {
      color: var(--primary-color);
      text-decoration: underline;
    }

    .legal-links .divider {
      color: #999;
      margin: 0 0.25rem;
    }

    /* Dark theme styles */
    :host-context(.dark-theme) .app-footer {
      background-color: #121212;
      border-top-color: #333;
    }

    :host-context(.dark-theme) .section-title,
    :host-context(.dark-theme) .logo-text,
    :host-context(.dark-theme) .footer-links a,
    :host-context(.dark-theme) .contact-info,
    :host-context(.dark-theme) .copyright,
    :host-context(.dark-theme) .legal-links a {
      color: #e0e0e0;
    }

    :host-context(.dark-theme) .footer-description,
    :host-context(.dark-theme) .footer-links a,
    :host-context(.dark-theme) .contact-info a,
    :host-context(.dark-theme) .legal-links a {
      color: #aaa;
    }

    :host-context(.dark-theme) .footer-bottom {
      border-top-color: #333;
    }

    :host-context(.dark-theme) .social-links a {
      color: #aaa;
    }

    :host-context(.dark-theme) .social-links a:hover {
      color: var(--primary-color);
    }
  `]
})
export class Footer {
  currentYear = new Date().getFullYear();

  // Quick links
  quickLinks: FooterLink[] = [
    { title: 'Home', path: '/', icon: 'home' },
    { title: 'JSON Formatter', path: '/', icon: 'code' },
    { title: 'About Us', path: '/about', icon: 'info' },
    { title: 'FAQ', path: '/faq', icon: 'help_outline' },
    { title: 'Changelog', path: '/changelog', icon: 'update' },
  ];

  // Resources
  resources: FooterLink[] = [
    { title: 'Documentation', path: '/docs', icon: 'description' },
    { title: 'API Reference', path: '/api', icon: 'api' },
    { title: 'GitHub Repository', path: 'https://github.com/yourusername/json-formatter', icon: 'code', external: true },
    { title: 'Report an Issue', path: 'https://github.com/yourusername/json-formatter/issues', icon: 'bug_report', external: true },
  ];
}
