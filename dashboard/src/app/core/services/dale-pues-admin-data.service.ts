import { Injectable, inject } from '@angular/core';
import { DalePuesUser } from '../../models/auth.models';
import {
  DalePuesBanner,
  DalePuesBusiness,
  DalePuesCategory,
  DalePuesProduct,
  DalePuesPromotion,
  DashboardStats
} from '../../models/dale-pues.models';
import { BannersService } from './banners.service';
import { BusinessesService } from './businesses.service';
import { CategoriesService } from './categories.service';
import { ProductsService } from './products.service';
import { PromotionsService } from './promotions.service';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class DalePuesAdminDataService {
  private readonly banners = inject(BannersService);
  private readonly businesses = inject(BusinessesService);
  private readonly categories = inject(CategoriesService);
  private readonly products = inject(ProductsService);
  private readonly promotions = inject(PromotionsService);
  private readonly users = inject(UsersService);

  async getDashboardStats(): Promise<DashboardStats> {
    const [categories, products, restaurants, users, couriers, pendingUsers, banners, promotions] = await Promise.all([
      this.categories.count(),
      this.products.count(),
      this.businesses.count('type = "restaurant"'),
      this.users.count(),
      this.users.count('type = "courier"'),
      this.users.count('status = "pending"'),
      this.banners.count(),
      this.promotions.count()
    ]);

    return {
      categories,
      products,
      restaurants,
      users,
      couriers,
      pendingUsers,
      banners,
      promotions
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

  async getBusinesses(): Promise<DalePuesBusiness[]> {
    return this.businesses.getAll();
  }

  async getUsers(): Promise<DalePuesUser[]> {
    return this.users.getFullList({ sort: '-updated' });
  }

  async getCouriers(): Promise<DalePuesUser[]> {
    return this.users.getCouriers();
  }

  async getBanners(): Promise<DalePuesBanner[]> {
    return this.banners.getFullList({ sort: 'section,position,created' });
  }

  async getPromotions(): Promise<DalePuesPromotion[]> {
    return this.promotions.getFullList({ sort: 'section,order,created', expand: 'business,product' });
  }
}
