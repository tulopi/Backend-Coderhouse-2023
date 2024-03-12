import { Routes } from '@angular/router';
import { HomeComponent } from './modules/landing/home/home.component';
import { ProductComponent } from './modules/landing/product/product.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'product/:id', component: ProductComponent}
];
