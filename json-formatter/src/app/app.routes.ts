import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { FaqComponent } from './pages/faq/faq';
import { AboutComponent } from './pages/about/about';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy';
import { ChangelogComponent } from './pages/changelog/changelog';

export const routes: Routes = [
  // Main tool pages with SEO-optimized routes
  { 
    path: '', 
    component: HomeComponent, 
    title: 'Lite JSON Formatter - Format, Validate & Convert JSON Online',
    data: {
      description: 'Free online JSON formatter, validator, and converter. Beautify, minify, and convert JSON to XML, YAML, and CSV with our easy-to-use tool.',
      keywords: 'JSON formatter, JSON validator, JSON to XML, JSON to YAML, JSON to CSV, format JSON, minify JSON, online JSON tool'
    }
  },
  
  // JSON Tools
  { 
    path: 'json-formatter', 
    redirectTo: '/', 
    pathMatch: 'full'
  },
  { 
    path: 'json-validator', 
    component: HomeComponent,
    title: 'JSON Validator - Validate & Fix JSON Online | Lite JSON Formatter',
    data: {
      description: 'Validate your JSON data and fix common errors with our free online JSON validator. Supports strict validation and error highlighting.',
      keywords: 'JSON validator, validate JSON, JSON syntax checker, JSON error finder, JSON lint'
    }
  },
  { 
    path: 'json-to-xml', 
    component: HomeComponent,
    title: 'JSON to XML Converter Online | Lite JSON Formatter',
    data: {
      description: 'Convert JSON to XML format quickly and easily with our free online tool. Supports complex JSON structures and preserves data integrity.',
      keywords: 'JSON to XML, convert JSON to XML, JSON XML converter, online JSON to XML'
    }
  },
  { 
    path: 'json-to-yaml', 
    component: HomeComponent,
    title: 'JSON to YAML Converter Online | Lite JSON Formatter',
    data: {
      description: 'Convert JSON to YAML format with our free online tool. Perfect for configuration files and data serialization.',
      keywords: 'JSON to YAML, convert JSON to YAML, JSON YAML converter, online JSON to YAML'
    }
  },
  { 
    path: 'json-to-csv', 
    component: HomeComponent,
    title: 'JSON to CSV Converter Online | Lite JSON Formatter',
    data: {
      description: 'Convert JSON data to CSV format for spreadsheets and data analysis. Supports nested JSON structures and custom field mapping.',
      keywords: 'JSON to CSV, convert JSON to CSV, JSON CSV converter, online JSON to CSV, export JSON to Excel'
    }
  },
  
  // Support & Information Pages
  { 
    path: 'faq', 
    component: FaqComponent, 
    title: 'Frequently Asked Questions | Lite JSON Formatter',
    data: {
      description: 'Find answers to common questions about using our JSON formatter, validator, and converter tools.',
      keywords: 'JSON formatter FAQ, JSON tools help, JSON formatter questions, JSON validator guide'
    }
  },
  { 
    path: 'about', 
    component: AboutComponent, 
    title: 'About Lite JSON Formatter | Our Mission & Features',
    data: {
      description: 'Learn about Lite JSON Formatter - our mission to provide simple, fast, and secure JSON tools for developers worldwide.',
      keywords: 'about JSON formatter, JSON tools, JSON formatter features, developer tools'
    }
  },
  { 
    path: 'privacy-policy', 
    component: PrivacyPolicyComponent, 
    title: 'Privacy Policy | Lite JSON Formatter',
    data: {
      description: 'Read our privacy policy to understand how we handle your data when you use our JSON formatter and converter tools.',
      keywords: 'JSON formatter privacy policy, data protection, privacy policy'
    }
  },
  { 
    path: 'changelog', 
    component: ChangelogComponent, 
    title: 'Changelog | Latest Updates to Lite JSON Formatter',
    data: {
      description: 'Stay updated with the latest features, improvements, and bug fixes in Lite JSON Formatter.',
      keywords: 'JSON formatter changelog, version history, latest updates, what\'s new'
    }
  },
  
  // Redirects for old URLs (if any)
  { path: 'format-json', redirectTo: '/', pathMatch: 'full' },
  { path: 'validate-json', redirectTo: '/json-validator', pathMatch: 'full' },
  
  // 404 handling - redirect to home with a flag
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full',
    data: { notFound: true }
  }
];
