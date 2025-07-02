import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface NavItem {
  title: string;
  path: string;
  icon: string;
  isExternal?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    RouterModule,
    ThemeToggle
  ],
  template: `
    <mat-toolbar class="app-header">
      <div class="header-content">
        <!-- Logo and Mobile Menu Button -->
        <div class="logo-container">
          <button mat-icon-button class="menu-button" (click)="toggleMobileMenu()" aria-label="Toggle menu">
            <mat-icon>menu</mat-icon>
          </button>
          <a [routerLink]="['/']" class="logo">
            <img src="/JsonFormatterIcon.png" alt="JSON Formatter Logo" class="logo-image">
            <h1 class="logo-text">{{ title }}</h1>
          </a>
        </div>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav" *ngIf="!isMobile">
          <a *ngFor="let item of navItems" 
             [routerLink]="[item.path]" 
             routerLinkActive="active"
             [routerLinkActiveOptions]="{exact: item.path === '/'}"
             mat-button
             class="nav-link">
            <mat-icon class="nav-icon">{{item.icon}}</mat-icon>
            {{item.title}}
          </a>
        </nav>

        <!-- Header Actions -->
        <div class="header-actions">
          <button mat-icon-button [matMenuTriggerFor]="moreMenu" class="more-button" *ngIf="isMobile">
            <mat-icon>more_vert</mat-icon>
          </button>
          <app-theme-toggle></app-theme-toggle>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen" *ngIf="isMobile">
        <div class="mobile-menu-content">
          <a *ngFor="let item of navItems" 
             [routerLink]="[item.path]" 
             (click)="closeMobileMenu()"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{exact: item.path === '/'}"
             class="mobile-nav-link">
            <mat-icon class="nav-icon">{{item.icon}}</mat-icon>
            <span class="nav-text">{{item.title}}</span>
          </a>
        </div>
      </div>
    </mat-toolbar>

    <!-- More Menu -->
    <mat-menu #moreMenu="matMenu" xPosition="before">
      <a *ngFor="let item of moreMenuItems" 
         [routerLink]="[item.path]" 
         mat-menu-item
         (click)="closeMobileMenu()">
        <mat-icon>{{item.icon}}</mat-icon>
        <span>{{item.title}}</span>
      </a>
    </mat-menu>
  `,
  styles: [`
    .app-header {
      background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
      color: white;
      position: relative;
      box-sizing: border-box;
      width: 100%;
      height: var(--header-height, 64px);
      padding: 0 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: height 0.3s ease;
    }

    .app-header.mobile-menu-open {
      height: 100vh;
    }

    .header-content {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      padding: 0 0.5rem;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .menu-button {
      display: none;
      margin-right: 0.5rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }

    .logo-text {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
      white-space: nowrap;
      color: #fff;
    }

    .logo-image {
      width: 32px;
      height: 28px;
      width: auto;
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
      gap: 0.5rem;
      margin-left: auto;
    }

    /* Desktop Navigation */
    .desktop-nav {
      display: flex;
      gap: 0.25rem;
      margin: 0 1rem;
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.9);
      text-transform: none;
      font-weight: 400;
      letter-spacing: 0.5px;
      border-radius: 4px;
      margin: 0 0.25rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      &.active {
        color: #fff;
        font-weight: 500;
        background: rgba(255, 255, 255, 0.15);
      }

      .nav-icon {
        font-size: 1.25rem;
        height: 1.25rem;
        width: 1.25rem;
        margin-right: 0.25rem;
      }
    }

    /* Mobile Navigation */
    .mobile-menu {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;
      z-index: 100;
      transform: translateY(-100%);
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
      overflow-y: auto;
      padding: 1rem 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

      &.open {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
      }
    }

    .mobile-menu-content {
      display: flex;
      flex-direction: column;
      padding: 0.5rem 0;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      color: rgba(0, 0, 0, 0.87);
      text-decoration: none;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      &.active {
        color: var(--primary-color);
        background-color: rgba(var(--primary-rgb), 0.08);
        font-weight: 500;
      }

      .nav-icon {
        margin-right: 1rem;
        color: inherit;
      }

      .nav-text {
        font-size: 1rem;
      }
    }

    /* Header Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
    }

    .more-button, .github-button {
      color: rgba(255, 255, 255, 0.9);

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }
    }

    /* Dark theme styles */
    :host-context(.dark-theme) {
      .mobile-menu {
        background: #1e1e1e;
      }

      .mobile-nav-link {
        color: rgba(255, 255, 255, 0.87);

        &:hover {
          background-color: rgba(255, 255, 255, 0.08);
        }

        &.active {
          background-color: rgba(var(--primary-rgb), 0.15);
        }
      }
    }

    /* Responsive styles */
    @media (max-width: 959px) {
      .desktop-nav {
        display: none;
      }

      .menu-button {
        display: block;
      }

      .logo-text {
        font-size: 1.1rem;
      }
    }

    @media (min-width: 960px) {
      .mobile-menu, .more-button {
        display: none !important;
      }
    }
  `]
})
export class Header implements OnInit {
  @Input() title = 'JSON Formatter';
  isMobile = false;
  mobileMenuOpen = false;

  // Navigation items
  navItems: NavItem[] = [
    { title: 'Formatter', path: '/', icon: 'code' },
    { title: 'About', path: '/about', icon: 'info' },
    { title: 'FAQ', path: '/faq', icon: 'help_outline' },
    { title: 'Changelog', path: '/changelog', icon: 'update' },
  ];

  // Items for the more menu (shown on mobile)
  moreMenuItems: NavItem[] = [
    { title: 'Privacy Policy', path: '/privacy-policy', icon: 'privacy_tip' },
    { title: 'GitHub', path: 'https://github.com/yourusername/json-formatter', icon: 'code', isExternal: true }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    // Check if the screen is mobile size
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      this.isMobile = result.matches;
      if (!this.isMobile) {
        this.mobileMenuOpen = false;
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }
}
