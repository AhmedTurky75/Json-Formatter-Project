// Type definitions for Google Analytics
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

declare const gtag: (...args: any[]) => void;
