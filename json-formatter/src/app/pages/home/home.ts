import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Formatter } from '../formatter/formatter';
import { FeaturesSectionComponent, FeatureCard } from '../../components/features-section/features-section';
import { StatsSectionComponent, StatItem } from '../../components/stats-section/stats-section';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule,
    RouterModule,
    Formatter,
    FeaturesSectionComponent,
    StatsSectionComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  // Features section data
  features: FeatureCard[] = [
    {
      icon: 'code',
      title: 'Easy to Use',
      description: 'Simple and intuitive interface for formatting and validating JSON data.'
    },
    {
      icon: 'bolt',
      title: 'Lightning Fast',
      description: 'Process your JSON data instantly with our optimized formatter.'
    },
    {
      icon: 'security',
      title: 'Secure',
      description: 'All processing happens in your browser. Your data never leaves your computer.'
    },
    {
      icon: 'devices',
      title: 'Cross-Platform',
      description: 'Works on any device with a modern web browser.'
    },
    {
      icon: 'palette',
      title: 'Themes',
      description: 'Choose between light and dark themes for comfortable viewing.'
    },
    {
      icon: 'share',
      title: 'Shareable',
      description: 'Easily share your formatted JSON with others.'
    }
  ];

  // Statistics data
  stats: StatItem[] = [
    { value: '100%', label: 'Client-Side Processing' },
    { value: '0', label: 'Data Stored' },
    { value: '∞', label: 'Usage Limit' },
    { value: '24/7', label: 'Availability' },
    { value: '15M+', label: 'Monthly Users' }
  ];
}
