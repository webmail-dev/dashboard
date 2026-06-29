import { Injectable, inject } from '@angular/core';
import { DalePuesUser } from '../../models/auth.models';
import { DalePuesBusiness, DalePuesCategory, DalePuesProduct, DashboardStats } from '../../models/dale-pues.models';
import { BusinessesService } from './businesses.service';
import { CategoriesService } from './categories.service';
import { ProductsService } from './products.service';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class DalePuesAdminDataService {
  private readonly businesses = inject(BusinessesService);
  private readonly categories = inject(CategoriesService);
  private readonly products = inject(ProductsService);
  private readonly users = inject(UsersService);

  async getDashboardStats(): Promise<DashboardStats> {
    const [categories, products, restaurants, users, couriers, pendingUsers] = await Promise.all([
      this.categories.count(),
      this.products.count(),
      this.businesses.count('type = "restaurant"'),
      this.users.count(),
      this.users.count('type = "courier"'),
      this.users.count('status = "pending"')
    ]);

    return {
      categories,
      products,
      restaurants,
      users,
      couriers,
      pendingUsers
    };
  }

  async getCategories(): Promise<DalePuesCategory[]> {
    return this.categories.getFullList({ sort: 'order,name' });
  }

  async getProducts(): Promise<DalePuesProduct[]> {
    return this.products.getFullList({ sort: '-updated', expand: 'business,category' });
  }

  async getRestaurants(): Promise<DalePuesBusiness[]> {
    return this.businesses.getRestaurants();
  }

  async getUsers(): Promise<DalePuesUser[]> {
    return this.users.getFullList({ sort: '-updated' });
  }

  async getCouriers(): Promise<DalePuesUser[]> {
    return this.users.getCouriers();
  }
}
