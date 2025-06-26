import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { Clipboard } from '@angular/cdk/clipboard';
import { JsonTreeView } from '../../components/json-tree-view/json-tree-view';

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
  isTreeView: boolean = false;
  parsedOutput: any = null;
  error: string | null = null;

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
    this.jsonOutput = 'Ahmed';
    console.log(this.jsonOutput);
    try {
      const parsed = JSON.parse(this.jsonInput);
      // Create a new reference to trigger change detection
      this.parsedOutput = JSON.parse(JSON.stringify(parsed));
      
      this.jsonOutput = JSON.stringify(parsed, null, 2);
      this.error = null;
      this.isTreeView = false;
      // Manually trigger change detection
      if (this.prismInitialized) {
        setTimeout(() => this.highlightCode(), 0);
      }
    } catch (error) {
      this.error = 'Invalid JSON. Please check your input.';
      this.jsonOutput = '';
      this.parsedOutput = null;
      this.showError(this.error);
    }
  }

  minifyJson() {
    try {
      const parsed = JSON.parse(this.jsonInput);
      // Create a new reference to trigger change detection
      this.parsedOutput = JSON.parse(JSON.stringify(parsed));
      this.jsonOutput = JSON.stringify(parsed);
      this.error = null;
      this.isTreeView = false;
      
      // Manually trigger change detection
      this.cdr.detectChanges();
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
    this.isTreeView = !this.isTreeView;
    if (!this.isTreeView && this.prismInitialized) {
      // Re-highlight code when switching back to code view
      setTimeout(() => this.highlightCode(), 0);
    }
  }
  
  private highlightCode() {
    if (typeof (window as any).Prism !== 'undefined') {
      // Only highlight the pre element with the 'line-numbers' class
      const preElement = this.elementRef.nativeElement.querySelector('pre.line-numbers');
      if (preElement) {
        // Remove any existing line numbers and re-apply Prism highlighting
        preElement.innerHTML = this.jsonOutput;
        (window as any).Prism.highlightElement(preElement);
      }
    }
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
