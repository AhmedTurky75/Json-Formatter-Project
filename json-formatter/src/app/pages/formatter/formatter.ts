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
import { JsonViewerComponent } from '../../components/json-viewer/json-viewer';
import { XMLBuilder  } from 'fast-xml-parser';
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
    JsonTreeView,
    JsonViewerComponent
  ],
  templateUrl: './formatter.html',
  styleUrls: ['./formatter.scss']
})
export class Formatter implements OnInit, OnDestroy {
  private prismInitialized = false;
  @ViewChild('jsonInputRef') jsonInputRef!: ElementRef<HTMLTextAreaElement>;
  
  jsonInput: string = '';
  jsonOutput: string = '';
  minifiedOutput: string = '';  // Store minified output separately
  convertedOutput: string = '';
  currentFormat: OutputFormat = 'json';
  viewMode: 'raw' | 'tree' | 'viewer' = 'raw';
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
      // First set the view mode to viewer to ensure it switches to the JSON viewer
      this.viewMode = 'viewer';
      
      // Parse and format the JSON
      const parsed = JSON.parse(this.jsonInput);
      // Create a new reference to trigger change detection
      this.parsedOutput = JSON.parse(JSON.stringify(parsed));
      this.jsonOutput = JSON.stringify(parsed, null, 2);
      this.minifiedOutput = ''; // Reset minified output
      this.error = null;
      this.isMinified = false;
      this.convertedOutput = ''; // Clear any previous conversion
      this.currentFormat = 'json';
      
      // Force change detection and update the view
      this.cdr.detectChanges();
      
      // Highlight the code after the view updates
      setTimeout(() => {
        this.highlightCode();
      });
    } catch (error) {
      this.error = 'Invalid JSON. Please check your input.';
      this.jsonOutput = '';
      this.parsedOutput = null;
      this.viewMode = 'raw'; // Switch to raw view on error
      this.showError(this.error);
    }
  }

  minifyJson() {
    try {
      let jsonToMinify = this.jsonInput;
      
      // Handle JSON minification
      const parsed = JSON.parse(jsonToMinify);
      this.parsedOutput = JSON.parse(JSON.stringify(parsed));
      this.minifiedOutput = JSON.stringify(parsed);
      this.jsonOutput = JSON.stringify(parsed, null, 2); // Keep formatted version
      this.error = null;
      this.viewMode = 'raw';
      this.isMinified = true;
      this.convertedOutput = ''; // Clear any previous conversion
      
      // // Highlight the code after the view updates
      // this.cdr.detectChanges();
      // this.highlightCode();
    } catch (error) {
      this.error = 'Invalid JSON. Please check your input.';
      this.jsonOutput = '';
      this.minifiedOutput = '';
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

  /**
   * Downloads the current content with appropriate file type and name
   * Handles all cases: minified JSON, formatted JSON, and converted formats (XML, YAML, CSV)
   */
  downloadCurrentContent() {
    // Determine content and file extension based on current state
    let content: string;
    let extension: string;
    let mimeType: string;
    let defaultFilename = 'output';

    if (this.convertedOutput) {
      // Handle converted formats (XML, YAML, CSV)
      content = this.convertedOutput;
      extension = this.currentFormat;
      mimeType = this.getMimeType(this.currentFormat);
      defaultFilename = `converted.${extension}`;
    } else if (this.isMinified && this.minifiedOutput) {
      // Handle minified JSON
      content = this.minifiedOutput;
      extension = 'json';
      mimeType = 'application/json';
      defaultFilename = 'minified.json';
    } else if (this.jsonOutput) {
      // Handle formatted JSON
      content = this.jsonOutput;
      extension = 'json';
      mimeType = 'application/json';
      defaultFilename = 'formatted.json';
    } else if (this.jsonInput) {
      // Fallback to input if no output is available
      content = this.jsonInput;
      extension = 'json';
      mimeType = 'application/json';
      defaultFilename = 'input.json';
    } else {
      // Nothing to download
      return;
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultFilename;
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

  setViewMode(mode: 'raw' | 'tree') {
    if (this.jsonInput) {
      try {
        const parsed = JSON.parse(this.jsonInput);
        this.parsedOutput = parsed;
        
        // When switching to raw view, ensure we show formatted JSON
        this.minifiedOutput = ''; // Reset minified output
        this.isMinified = false;
        if (mode === 'raw') {
          this.jsonOutput = JSON.stringify(parsed, null, 2);
          this.error = null;
          this.convertedOutput = ''; // Clear any previous conversion
          this.currentFormat = 'json';
          
          // Force change detection and update the view
          this.cdr.detectChanges();
          
          // Highlight the code after the view updates
          setTimeout(() => {
            this.highlightCode();
          });
        }
      } catch (e) {
        this.error = 'Invalid JSON. Please check your input.';
        this.showError(this.error);
        return;
      }
    }
    
    this.viewMode = mode;
    
    // Re-highlight code when switching to raw view
    if (this.viewMode === 'raw' && this.prismInitialized) {
      setTimeout(() => this.highlightCode(), 0);
    }
  }
  
  convertToXml() {
    try {
      const input = this.jsonInput;
      const parsed = JSON.parse(input);
      const builder = new XMLBuilder({
        format: true,
        indentBy: '  ', // 2 spaces
        ignoreAttributes: false,
      });
      
      this.convertedOutput = builder.build(parsed);
      this.currentFormat = 'xml';
      this.isMinified = false;
      this.isTreeView = false;
      this.viewMode = 'raw';
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
      this.viewMode = 'raw';
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
      
      // Generate the CSV content directly without triggering download
      let csvContent = '';
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
        csvContent = csvRows.join('\n');
        this.convertedOutput = csvContent;
      } else {
        this.convertedOutput = '';
      }
      
      this.currentFormat = 'csv';
      this.isMinified = false;
      this.conversionError = null;
      this.viewMode = 'raw';
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

  /**
   * @deprecated Use downloadCurrentContent() instead
   */
  downloadConverted() {
    this.downloadCurrentContent();
  }

  /**
   * @deprecated Use downloadCurrentContent() instead
   */
  downloadJson() {
    this.downloadCurrentContent();
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
