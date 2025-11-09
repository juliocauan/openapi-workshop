import { Routes } from '@angular/router';
import { ProductFormComponent } from './product-form/product-form.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductFormComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  }
];
