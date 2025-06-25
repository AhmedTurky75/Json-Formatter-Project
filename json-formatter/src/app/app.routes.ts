import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Formatter } from './pages/formatter/formatter';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'JSON Formatter - Home' },
  { path: 'format', component: Formatter, title: 'JSON Formatter' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
