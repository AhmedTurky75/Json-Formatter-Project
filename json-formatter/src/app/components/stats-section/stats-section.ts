import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatItem {
  value: string;
  label: string;
}

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-section.html',
  styleUrls: ['./stats-section.scss']
})
export class StatsSectionComponent {
  @Input() stats: StatItem[] = [];
  
  // Default stats if none provided
  defaultStats: StatItem[] = [
    { value: '100%', label: 'Client-Side Processing' },
    { value: '0', label: 'Data Stored' },
    { value: '∞', label: 'Usage Limit' },
    { value: '24/7', label: 'Availability' },
    { value: '16M+', label: 'Monthly Users' }
  ];

  get displayStats(): StatItem[] {
    return this.stats.length > 0 ? this.stats : this.defaultStats;
  }
}
