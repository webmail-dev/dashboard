import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPageComponent),
    title: 'Admin Dale Pues'
  },
  {
    path: '',
    canActivate: [adminAuthGuard],
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
      },
      {
        path: 'restaurants',
        loadComponent: () => import('./pages/restaurants/restaurants').then((m) => m.RestaurantsPageComponent)
      },
      {
        path: 'businesses',
        loadComponent: () => import('./pages/businesses/businesses').then((m) => m.BusinessesPageComponent)
      },
      {
        path: 'banners',
        loadComponent: () => import('./pages/banners/banners').then((m) => m.BannersPageComponent)
      },
      {
        path: 'promotions',
        loadComponent: () => import('./pages/promotions/promotions').then((m) => m.PromotionsPageComponent)
      },
      {
        path: 'drivers',
        loadComponent: () => import('./pages/drivers/drivers').then((m) => m.DriversPageComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
