import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const Prism: any;

@Injectable({
  providedIn: 'root'
})
export class PrismService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  highlightAll() {
    if (this.isBrowser && typeof Prism !== 'undefined') {
      Prism.highlightAll();
    }
  }

  highlightElement(element: HTMLElement) {
    if (this.isBrowser && typeof Prism !== 'undefined' && element) {
      Prism.highlightElement(element);
    }
  }
}
