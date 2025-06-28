import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { FaqComponent } from './pages/faq/faq';
import { AboutComponent } from './pages/about/about';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy';
import { ChangelogComponent } from './pages/changelog/changelog';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'JSON Formatter' },
  { path: 'faq', component: FaqComponent, title: 'FAQ - JSON Formatter' },
  { path: 'about', component: AboutComponent, title: 'About - JSON Formatter' },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, title: 'Privacy Policy - JSON Formatter' },
  { path: 'changelog', component: ChangelogComponent, title: 'Changelog - JSON Formatter' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
