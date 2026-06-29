import { Injectable, inject } from '@angular/core';
import { RecordModel } from 'pocketbase';
import { DalePuesUser } from '../../models/auth.models';
import { DalePuesBusiness, DalePuesCategory, DalePuesProduct, DashboardStats } from '../../models/dale-pues.models';
import { PocketbaseService } from './pocketbase.service';

@Injectable({ providedIn: 'root' })
export class DalePuesAdminDataService {
  private readonly pb = inject(PocketbaseService).getInstance();

  async getDashboardStats(): Promise<DashboardStats> {
    const [categories, products, restaurants, users, couriers, pendingUsers] = await Promise.all([
      this.count('categories'),
      this.count('products'),
      this.count('businesses', 'type = "restaurant"'),
      this.count('users'),
      this.count('users', 'type = "courier"'),
      this.count('users', 'status = "pending"')
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

  getImageUrl(record: RecordModel, fieldName: string): string {
    const fileValue = record[fieldName];
    const urlValue = record[`${fieldName}Url`];

    if (typeof urlValue === 'string' && urlValue.length > 0) {
      return urlValue;
    }

    if (Array.isArray(fileValue) && fileValue.length > 0) {
      return this.pb.files.getURL(record, fileValue[0]);
    }

    if (typeof fileValue === 'string' && fileValue.length > 0) {
      if (fileValue.startsWith('assets/') || fileValue.startsWith('http')) {
        return fileValue;
      }

      return this.pb.files.getURL(record, fileValue);
    }

    return '';
  }

  async getCategories(): Promise<DalePuesCategory[]> {
    const records = await this.pb.collection('categories').getFullList({
      sort: 'order,name',
      requestKey: null
    });

    return records.map((record) => ({
      id: record.id,
      name: record['name'],
      slug: record['slug'],
      type: record['type'],
      image: this.getImageUrl(record, 'image'),
      imageUrl: record['imageUrl'],
      icon: record['icon'],
      alt: record['alt'],
      link: record['link'],
      active: record['active'],
      order: record['order'],
      created: record['created'],
      updated: record['updated']
    }));
  }

  async getProducts(): Promise<DalePuesProduct[]> {
    const records = await this.pb.collection('products').getFullList({
      sort: '-updated',
      expand: 'business,category',
      requestKey: null
    });

    return records.map((record) => ({
      id: record.id,
      business: record['business'],
      category: record['category'],
      name: record['name'],
      slug: record['slug'],
      description: record['description'],
      image: this.getImageUrl(record, 'image'),
      imageUrl: record['imageUrl'],
      alt: record['alt'],
      type: record['type'],
      price: Number(record['price'] || 0),
      oldPrice: record['oldPrice'] ? Number(record['oldPrice']) : undefined,
      currency: record['currency'],
      rating: Number(record['rating'] || 0),
      stock: Number(record['stock'] || 0),
      featured: record['featured'],
      active: record['active'],
      deliveryTime: record['deliveryTime'],
      tags: this.getTags(record),
      ctaText: record['ctaText'],
      created: record['created'],
      updated: record['updated']
    }));
  }

  async getRestaurants(): Promise<DalePuesBusiness[]> {
    const records = await this.pb.collection('businesses').getFullList({
      filter: 'type = "restaurant"',
      sort: '-featured,name',
      requestKey: null
    });

    return records.map((record) => ({
      id: record.id,
      name: record['name'],
      slug: record['slug'],
      type: record['type'],
      logo: this.getImageUrl(record, 'logo'),
      cover: this.getImageUrl(record, 'cover'),
      logoUrl: record['logoUrl'],
      coverUrl: record['coverUrl'],
      description: record['description'],
      phone: record['phone'],
      whatsapp: record['whatsapp'],
      address: record['address'],
      city: record['city'],
      state: record['state'],
      country: record['country'],
      lat: Number(record['lat'] || 0),
      lng: Number(record['lng'] || 0),
      rating: Number(record['rating'] || 0),
      deliveryTime: record['deliveryTime'],
      active: record['active'],
      featured: record['featured'],
      owner: record['owner'],
      created: record['created'],
      updated: record['updated']
    }));
  }

  async getUsers(): Promise<DalePuesUser[]> {
    const records = await this.pb.collection('users').getFullList({
      sort: '-updated',
      requestKey: null
    });

    return records.map((record) => ({
      id: record.id,
      email: record['email'],
      name: record['name'],
      phone: record['phone'],
      type: record['type'],
      status: record['status'],
      avatar: this.getImageUrl(record, 'avatar'),
      address: record['address'],
      city: record['city'],
      state: record['state'],
      country: record['country'],
      roleDescription: record['roleDescription'],
      lastLoginAt: record['lastLoginAt'],
      profileCompleted: record['profileCompleted'],
      termsAccepted: record['termsAccepted'],
      businessName: record['businessName'],
      businessType: record['businessType'],
      identityDocument: record['identityDocument'],
      vehicleType: record['vehicleType']
    }));
  }

  async getCouriers(): Promise<DalePuesUser[]> {
    const records = await this.pb.collection('users').getFullList({
      filter: 'type = "courier"',
      sort: '-updated',
      requestKey: null
    });

    return records.map((record) => ({
      id: record.id,
      email: record['email'],
      name: record['name'],
      phone: record['phone'],
      type: record['type'],
      status: record['status'],
      avatar: this.getImageUrl(record, 'avatar'),
      address: record['address'],
      city: record['city'],
      state: record['state'],
      country: record['country'],
      roleDescription: record['roleDescription'],
      lastLoginAt: record['lastLoginAt'],
      profileCompleted: record['profileCompleted'],
      termsAccepted: record['termsAccepted'],
      businessName: record['businessName'],
      businessType: record['businessType'],
      identityDocument: record['identityDocument'],
      vehicleType: record['vehicleType']
    }));
  }

  private async count(collection: string, filter?: string): Promise<number> {
    try {
      const result = await this.pb.collection(collection).getList(1, 1, {
        filter,
        requestKey: null
      });
      return result.totalItems;
    } catch {
      return 0;
    }
  }

  private getTags(record: RecordModel): Record<string, string> {
    const tags = record['tags'];
    return tags && typeof tags === 'object' && !Array.isArray(tags) ? tags : {};
  }
}
