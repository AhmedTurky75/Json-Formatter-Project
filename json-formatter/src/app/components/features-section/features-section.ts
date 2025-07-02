import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface StatItem {
  value: string;
  label: string;
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './features-section.html',
  styleUrls: ['./features-section.scss']
})
export class FeaturesSectionComponent {
  @Input() title: string = 'Why Choose Our JSON Formatter?';
  @Input() description: string = 'Experience the difference with our feature-rich JSON tool';
  @Input() features: FeatureCard[] = [];
  @Input() maxFeatures: number | null = null;
  @Input() width: string = '100%';

  // Default features if none provided
  defaultFeatures: FeatureCard[] = [
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

  get displayFeatures(): FeatureCard[] {
    return this.features.length > 0 ? this.features : this.defaultFeatures;
  }
}
