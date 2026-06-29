import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardPageComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products').then((m) => m.ProductsPageComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories').then((m) => m.CategoriesPageComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users').then((m) => m.UsersPageComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
