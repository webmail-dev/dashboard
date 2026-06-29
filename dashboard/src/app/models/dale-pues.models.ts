export type ContentSection = 'home' | 'food' | 'grocery' | 'pharmacy';
export type BusinessType = 'restaurant' | 'grocery' | 'pharmacy' | 'courier' | 'store';
export type ProductType = 'food' | 'grocery' | 'pharmacy';

export interface DalePuesCategory {
  id: string;
  name: string;
  slug: string;
  type: ContentSection;
  image?: string;
  imageUrl?: string;
  icon?: string;
  alt?: string;
  link?: string;
  active?: boolean;
  order?: number;
  created?: string;
  updated?: string;
}

export interface DalePuesBusiness {
  id: string;
  name: string;
  slug: string;
  type: BusinessType;
  logo?: string;
  cover?: string;
  logoUrl?: string;
  coverUrl?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  rating?: number;
  deliveryTime?: string;
  active?: boolean;
  featured?: boolean;
  owner?: string;
  created?: string;
  updated?: string;
}

export interface DalePuesProduct {
  id: string;
  business?: string;
  category?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  alt?: string;
  type: ProductType;
  price: number;
  oldPrice?: number;
  currency?: string;
  rating?: number;
  stock?: number;
  featured?: boolean;
  active?: boolean;
  deliveryTime?: string;
  tags?: Record<string, string>;
  ctaText?: string;
  created?: string;
  updated?: string;
}

export interface DashboardStats {
  categories: number;
  products: number;
  restaurants: number;
  users: number;
  couriers: number;
  pendingUsers: number;
}
