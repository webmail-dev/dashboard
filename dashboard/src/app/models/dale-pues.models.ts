export type ContentSection = 'home' | 'food' | 'grocery' | 'pharmacy';
export type BusinessType = 'restaurant' | 'grocery' | 'pharmacy' | 'courier' | 'store';
export type ProductType = 'food' | 'grocery' | 'pharmacy';
export type DiscountType = 'percentage' | 'fixed' | 'combo' | 'text';

export type FileInput = File | Blob | string | null | undefined;

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

export type DalePuesCategoryPayload = Partial<Omit<DalePuesCategory, 'id' | 'image' | 'created' | 'updated'>> & {
  image?: FileInput;
};

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
  ownerName?: string;
  created?: string;
  updated?: string;
}

export type DalePuesBusinessPayload = Partial<
  Omit<DalePuesBusiness, 'id' | 'logo' | 'cover' | 'created' | 'updated'>
> & {
  logo?: FileInput;
  cover?: FileInput;
};

export interface DalePuesProduct {
  id: string;
  business?: string;
  businessName?: string;
  category?: string;
  categoryName?: string;
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

export type DalePuesProductPayload = Partial<Omit<DalePuesProduct, 'id' | 'image' | 'created' | 'updated'>> & {
  image?: FileInput;
};

export interface DalePuesBanner {
  id: string;
  title: string;
  subtitle?: string;
  highlight?: string;
  image?: string;
  imageUrl?: string;
  alt?: string;
  ctaText?: string;
  link?: string;
  section: ContentSection;
  position?: number;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  created?: string;
  updated?: string;
}

export type DalePuesBannerPayload = Partial<Omit<DalePuesBanner, 'id' | 'image' | 'created' | 'updated'>> & {
  image?: FileInput;
};

export interface DalePuesPromotion {
  id: string;
  title: string;
  description?: string;
  business?: string;
  businessName?: string;
  product?: string;
  productName?: string;
  section: ContentSection;
  discountType: DiscountType;
  discountValue?: number;
  badgeText?: string;
  image?: string;
  imageUrl?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  order?: number;
  created?: string;
  updated?: string;
}

export type DalePuesPromotionPayload = Partial<
  Omit<DalePuesPromotion, 'id' | 'image' | 'created' | 'updated'>
> & {
  image?: FileInput;
};

export interface DashboardStats {
  categories: number;
  products: number;
  restaurants: number;
  users: number;
  couriers: number;
  pendingUsers: number;
  banners: number;
  promotions: number;
}
