import { Injectable } from '@angular/core';
import { RecordModel } from 'pocketbase';
import { DalePuesProduct, DalePuesProductPayload, ProductType } from '../../models/dale-pues.models';
import { DalePuesCrudService } from './dale-pues-crud.service';

@Injectable({ providedIn: 'root' })
export class ProductsService extends DalePuesCrudService<DalePuesProduct, DalePuesProductPayload> {
  protected readonly collectionName = 'products';

  getByType(type: ProductType): Promise<DalePuesProduct[]> {
    return this.getFullList({
      filter: `type = "${type}"`,
      sort: '-featured,created',
      expand: 'business,category'
    });
  }

  getFeatured(): Promise<DalePuesProduct[]> {
    return this.getFullList({
      filter: 'featured = true',
      sort: '-updated',
      expand: 'business,category'
    });
  }

  setFeatured(id: string, featured: boolean): Promise<DalePuesProduct> {
    return this.update(id, { featured });
  }

  protected mapRecord(record: RecordModel): DalePuesProduct {
    return {
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
    };
  }

  private getTags(record: RecordModel): Record<string, string> {
    const tags = record['tags'];
    return tags && typeof tags === 'object' && !Array.isArray(tags) ? tags : {};
  }
}
