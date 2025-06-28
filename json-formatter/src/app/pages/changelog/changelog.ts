import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface Version {
  version: string;
  date: string;
  highlights: string[];
  newFeatures?: string[];
  improvements?: string[];
  fixes?: string[];
  breakingChanges?: string[];
}

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './changelog.html',
  styleUrls: ['./changelog.scss']
})
export class ChangelogComponent {
  // Current version - should match package.json
  currentVersion = '1.2.0';
  lastUpdated = 'June 28, 2025';

  // All versions in reverse chronological order
  versions: Version[] = [
    {
      version: '1.2.0',
      date: 'June 28, 2025',
      highlights: [
        'Added new static pages: About, FAQ, Privacy Policy, and Changelog',
        'Improved mobile responsiveness across all pages',
        'Enhanced accessibility features'
      ],
      newFeatures: [
        'Added dark/light theme toggle',
        'Added keyboard shortcuts for common actions',
        'Added ability to copy formatted JSON with one click',
        'Added syntax highlighting for JSON values'
      ],
      improvements: [
        'Reduced initial page load time by 40%',
        'Improved error messages for invalid JSON',
        'Better handling of large JSON files',
        'Updated dependencies to their latest versions'
      ],
      fixes: [
        'Fixed issue with special characters in JSON keys',
        'Fixed memory leak when processing large files',
        'Fixed alignment issues in the navigation menu',
        'Fixed minor UI glitches on mobile devices'
      ]
    },
    {
      version: '1.1.0',
      date: 'May 15, 2025',
      highlights: [
        'Completely redesigned user interface',
        'Added support for JSON Schema validation',
        'Improved performance for large JSON files'
      ],
      newFeatures: [
        'Added tree view for better navigation of complex JSON',
        'Added support for JSON5 format',
        'Added option to format JSON with 2 or 4 spaces',
        'Added dark mode support'
      ],
      improvements: [
        'Faster JSON parsing algorithm',
        'Better error handling and reporting',
        'Improved mobile responsiveness',
        'Updated documentation and examples'
      ],
      fixes: [
        'Fixed issue with special characters in strings',
        'Fixed performance issues with large arrays',
        'Fixed various UI bugs'
      ]
    },
    {
      version: '1.0.0',
      date: 'March 1, 2025',
      highlights: [
        'Initial public release of JSON Formatter',
        'Basic JSON formatting and validation',
        'Support for minifying and beautifying JSON'
      ],
      newFeatures: [
        'Format and validate JSON in real-time',
        'Minify JSON to save space',
        'Beautify JSON for better readability',
        'Copy to clipboard with one click',
        'Download formatted JSON as a file'
      ],
      improvements: [
        'Intuitive user interface',
        'Fast and efficient processing',
        'Clean and modern design'
      ]
    },
    {
      version: '0.9.0',
      date: 'February 15, 2025',
      highlights: [
        'Beta release for testing',
        'Core JSON formatting functionality',
        'Basic error handling'
      ],
      improvements: [
        'Initial beta release for community testing',
        'Basic JSON validation',
        'Simple formatting options'
      ]
    }
  ];

  // Get the latest version details
  get latestVersion(): Version | undefined {
    return this.versions[0];
  }

  // Check if version is the current version
  isCurrentVersion(version: string): boolean {
    return version === this.currentVersion;
  }

  // Format version number for display
  formatVersion(version: string): string {
    return `v${version}`;
  }

  // Get the release date as a Date object
  getReleaseDate(dateString: string): Date {
    return new Date(dateString);
  }

  // Get the number of days since release
  getDaysSinceRelease(dateString: string): number {
    const releaseDate = this.getReleaseDate(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - releaseDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if a version has any of the optional sections
  hasSection(version: Version, section: 'newFeatures' | 'improvements' | 'fixes' | 'breakingChanges'): boolean {
    const sectionValue = version[section];
    return Array.isArray(sectionValue) && sectionValue.length > 0;
  }
}
