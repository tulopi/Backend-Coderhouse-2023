import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ProductComponent } from '../product/product.component';

export const homeRoutes: Routes = [
  { path: 'product/:id', component: ProductComponent },
  { path: '', component: HomeComponent },
];
