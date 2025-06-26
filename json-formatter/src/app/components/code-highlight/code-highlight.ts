import { Component, Input, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismService } from '../../services/prism.service';

@Component({
  selector: 'app-code-highlight',
  standalone: true,
  imports: [CommonModule],
  template: `
    <pre [class]="language">
      <code [class]="language"><ng-content></ng-content></code>
    </pre>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    pre {
      margin: 0;
      padding: 1em;
      border-radius: 0.375rem;
      overflow-x: auto;
    }
    
    code {
      display: block;
      font-family: 'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', monospace;
      tab-size: 2;
      -moz-tab-size: 2;
      -o-tab-size: 2;
      -webkit-tab-size: 2;
    }
  `]
})
export class CodeHighlightComponent implements AfterViewInit, OnChanges {
  @Input() language = 'language-javascript';
  
  constructor(
    private el: ElementRef,
    private prism: PrismService
  ) {}

  ngAfterViewInit() {
    this.highlight();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['language']) {
      this.highlight();
    }
  }

  private highlight() {
    const codeElement = this.el.nativeElement.querySelector('code');
    if (codeElement) {
      codeElement.className = this.language;
      this.prism.highlightElement(codeElement);
    }
  }
}
