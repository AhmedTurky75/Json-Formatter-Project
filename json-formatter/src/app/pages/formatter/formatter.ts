import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { Clipboard } from '@angular/cdk/clipboard';
import { JsonTreeView } from '../../components/json-tree-view/json-tree-view';
import * as xmljs from 'xml-js';
import * as yaml from 'js-yaml';
import JsonToCSV from 'json-to-csv-export';

type OutputFormat = 'json' | 'xml' | 'yaml' | 'csv';

@Component({
  selector: 'app-formatter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule,
    MatTabsModule,
    JsonTreeView
  ],
  templateUrl: './formatter.html',
  styleUrls: ['./formatter.scss']
})
export class Formatter implements OnInit, OnDestroy {
  private prismInitialized = false;
  @ViewChild('jsonInputRef') jsonInputRef!: ElementRef<HTMLTextAreaElement>;
  
  jsonInput: string = '';
  jsonOutput: string = '';
  convertedOutput: string = '';
  currentFormat: OutputFormat = 'json';
  isTreeView: boolean = false;
  isMinified: boolean = false;
  parsedOutput: any = null;
  error: string | null = null;
  conversionError: string | null = null;

  constructor(
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (typeof window !== 'undefined' && (window as any).Prism) {
      this.prismInitialized = true;
    }
  }

  ngOnInit() {
    // Load sample JSON on init
    this.loadSample();
  }

  formatJson() {
    try {
      const parsed = JSON.parse(this.jsonInput);
      // Create a new reference to trigger change detection
      this.parsedOutput = JSON.parse(JSON.stringify(parsed));
      this.jsonOutput = JSON.stringify(parsed, null, 2);
      this.error = null;
      this.isTreeView = false;
      this.isMinified = false;
      this.convertedOutput = ''; // Clear any previous conversion
      this.currentFormat = 'json';
      
      // Highlight the code after the view updates
      this.cdr.detectChanges();
      this.highlightCode();
    } catch (error) {
      this.error = 'Invalid JSON. Please check your input.';
      this.jsonOutput = '';
      this.parsedOutput = null;
      this.showError(this.error);
    }
  }

  minifyJson() {
    try {
      let jsonToMinify = this.jsonInput;
      
      // Handle JSON minification
      const parsed = JSON.parse(jsonToMinify);
      this.parsedOutput = JSON.parse(JSON.stringify(parsed));
      this.jsonOutput = JSON.stringify(parsed);
      this.error = null;
      this.isTreeView = false;
      this.isMinified = true;
      this.convertedOutput = ''; // Clear any previous conversion
      
      // Highlight the code after the view updates
      this.cdr.detectChanges();
      this.highlightCode();
    } catch (error) {
      this.error = 'Invalid JSON. Please check your input.';
      this.jsonOutput = '';
      this.parsedOutput = null;
      this.showError(this.error);
    }
  }

  copyToClipboard() {
    if (this.jsonOutput) {
      this.clipboard.copy(this.jsonOutput);
      this.showSuccess('JSON copied to clipboard!');
    } else if (this.jsonInput) {
      this.clipboard.copy(this.jsonInput);
      this.showSuccess('Input copied to clipboard!');
    }
  }

  downloadJson() {
    const content = this.jsonOutput || this.jsonInput;
    if (!content) return;
    
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.jsonOutput ? 'formatted.json' : 'input.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  
  clearInput() {
    this.jsonInput = '';
    this.jsonOutput = '';
    this.parsedOutput = null;
    this.error = null;
    this.jsonInputRef.nativeElement.focus();
  }
  
  loadSample() {
    this.jsonInput = `{
  "app": {
    "name": "JSON Formatter",
    "version": "1.0.0",
    "features": ["format", "minify", "validate", "tree view"],
    "settings": {
      "theme": "auto",
      "indentSize": 2,
      "autoFormat": true
    }
  },
  "author": "Your Name",
  "license": "MIT"
}`;
    this.formatJson();
  }

  toggleView() {
    if (this.parsedOutput) {
      this.isTreeView = !this.isTreeView;
      // If switching to tree view, make sure we have parsed output
      if (this.isTreeView && !this.parsedOutput && this.jsonInput) {
        try {
          this.parsedOutput = JSON.parse(this.jsonInput);
        } catch (e) {
          // Handle error if needed
        }
      }
    }
    if (!this.isTreeView && this.prismInitialized) {
      // Re-highlight code when switching back to code view
      setTimeout(() => this.highlightCode(), 0);
    }
  }
  
  convertToXml() {
    try {
      const input = this.jsonInput;
      const parsed = JSON.parse(input);
      this.convertedOutput = xmljs.js2xml(parsed, { compact: true, spaces: 2 });
      this.currentFormat = 'xml';
      this.isMinified = false;
      this.isTreeView = false;

      this.error = null;
      this.conversionError = null;
      console.log(this.convertedOutput);
      this.cdr.detectChanges();
      this.highlightConvertedCode();
    } catch (error) {
      this.handleConversionError(error, 'XML');
    }
  }

  convertToYaml() {
    try {
      const input = this.jsonInput;
      const parsed = JSON.parse(input);
      this.convertedOutput = yaml.dump(parsed, { indent: 2 });
      this.currentFormat = 'yaml';
      this.isMinified = false;
      this.error = null;
      this.conversionError = null;
      this.isTreeView = false;

      console.log(this.convertedOutput);
      this.cdr.detectChanges();
      this.highlightConvertedCode();
    } catch (error) {
      this.handleConversionError(error, 'YAML');
    }
  }

  convertToCsv() {
    try {
      const parsed = JSON.parse(this.jsonInput);
      const data = Array.isArray(parsed) ? parsed : [parsed];
      
      // Flatten nested objects for CSV
      const flatten = (obj: any, prefix = ''): any => {
        return Object.keys(obj).reduce((acc: any, k) => {
          const pre = prefix.length ? prefix + '.' : '';
          if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flatten(obj[k], pre + k));
          } else {
            acc[pre + k] = obj[k];
          }
          return acc;
        }, {});
      };

      const flattenedData = data.map(item => flatten(item));
      
      // Create a temporary element to hold the CSV data
      const tempDiv = document.createElement('div');
      
      // Use the JsonToCSV function to handle the conversion
      JsonToCSV({
        data: flattenedData,
        filename: 'converted',
        delimiter: ','
      });
      
      // Since the package doesn't return the CSV string, we'll generate it manually
      if (flattenedData.length > 0) {
        const headers = Object.keys(flattenedData[0]);
        const csvRows = [
          headers.join(','),
          ...flattenedData.map(row => 
            headers.map(fieldName => 
              `"${String(row[fieldName] || '').replace(/"/g, '""')}"`
            ).join(',')
          )
        ];
        this.convertedOutput = csvRows.join('\n');
      } else {
        this.convertedOutput = '';
      }
      
      this.currentFormat = 'csv';
      this.isMinified = false;
      this.conversionError = null;
      this.isTreeView = false;
      this.cdr.detectChanges();
      this.highlightConvertedCode();
    } catch (error) {
      this.handleConversionError(error, 'CSV');
    }
  }

  private handleConversionError(error: any, format: string) {
    this.conversionError = `Error converting to ${format}: ${error.message}`;
    this.showError(this.conversionError);
    console.error(`Error converting to ${format}:`, error);
  }
  /**
   * Highlights JSON code using Prism.js
   * Uses requestAnimationFrame for better performance and to ensure DOM is ready
   */
  private highlightCode() {
    if (typeof (window as any).Prism === 'undefined') {
      console.warn('Prism.js is not loaded');
      return;
    }

    // Use requestAnimationFrame to ensure the view has been updated
    requestAnimationFrame(() => {
      const selector = this.isMinified ? 'pre.minified-json' : 'pre.language-json';
      const preElement = this.elementRef.nativeElement.querySelector(selector);
      
      if (!preElement) {
        console.warn('Could not find JSON pre element to highlight');
        return;
      }

      try {
        // Only update content if it's different to avoid unnecessary DOM updates
        if (preElement.textContent !== this.jsonOutput) {
          preElement.textContent = this.jsonOutput;
        }
        
        // Use Prism to highlight the code
        (window as any).Prism.highlightElement(preElement);
      } catch (error) {
        console.error('Error highlighting JSON code:', error);
      }
    });
  }

  /**
   * Highlights converted code (XML/YAML/CSV) using Prism.js
   * Uses a more robust approach to ensure highlighting works with dynamic content
   */
  private highlightConvertedCode() {
    if (typeof (window as any).Prism === 'undefined') {
      console.warn('Prism.js is not loaded');
      return;
    }

    // Use a small delay to ensure the view has been updated
    setTimeout(() => {
      try {
        // Find the pre element for the current format
        const preElement = this.elementRef.nativeElement.querySelector(
          `pre.language-${this.currentFormat}`
        );

        if (!preElement) {
          console.warn(`Could not find pre element for format: ${this.currentFormat}`);
          return;
        }

        // Find the code element inside the pre element
        const codeElement = preElement.querySelector('code');
        if (!codeElement) {
          console.warn('Could not find code element inside pre element');
          return;
        }

        // Only update content if it's different to avoid unnecessary DOM updates
        if (codeElement.textContent !== this.convertedOutput) {
          codeElement.textContent = this.convertedOutput;
        }

        // Use Prism to highlight the code
        (window as any).Prism.highlightElement(codeElement);
      } catch (error) {
        console.error('Error highlighting converted code:', error);
      }
    }, 0);
  }

  copyConvertedToClipboard() {
    if (this.convertedOutput) {
      this.clipboard.copy(this.convertedOutput);
      this.showSuccess(`${this.currentFormat.toUpperCase()} copied to clipboard!`);
    }
  }

  downloadConverted() {
    if (!this.convertedOutput) return;
    
    const blob = new Blob([this.convertedOutput], { type: this.getMimeType(this.currentFormat) });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${this.currentFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private getMimeType(format: OutputFormat): string {
    const types: Record<OutputFormat, string> = {
      'json': 'application/json',
      'xml': 'application/xml',
      'yaml': 'text/yaml',
      'csv': 'text/csv'
    };
    return types[format] || 'text/plain';
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
