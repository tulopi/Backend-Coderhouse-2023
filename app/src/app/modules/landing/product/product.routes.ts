import { Routes } from '@angular/router';
import { ProductComponent } from './product.component';

export default [
  {
    path: ':id',
    component: ProductComponent,
  },
] as Routes;
