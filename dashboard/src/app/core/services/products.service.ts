import { Injectable } from '@angular/core';
import { ListResult, RecordModel } from 'pocketbase';
import { DalePuesProduct, DalePuesProductPayload, ProductType } from '../../models/dale-pues.models';
import { DalePuesCrudService } from './dale-pues-crud.service';

@Injectable({ providedIn: 'root' })
export class ProductsService extends DalePuesCrudService<DalePuesProduct, DalePuesProductPayload> {
  protected readonly collectionName = 'products';

  async getDashboardProducts(): Promise<DalePuesProduct[]> {
    const result = await this.getDashboardProductRecords();
    const products = result.items.map((record) => this.mapRecord(record));
    await this.resolveProductRelations(products);
    return products;
  }

  getByType(type: ProductType): Promise<DalePuesProduct[]> {
    return this.getFullList({
      filter: `type = "${type}"`,
      sort: '-featured,created'
    });
  }

  getFeatured(): Promise<DalePuesProduct[]> {
    return this.getFullList({
      filter: 'featured = true',
      sort: '-updated'
    });
  }

  setFeatured(id: string, featured: boolean): Promise<DalePuesProduct> {
    return this.update(id, { featured });
  }

  protected mapRecord(record: RecordModel): DalePuesProduct {
    return {
      id: record.id,
      business: record['business'],
      businessName: this.getExpandedText(record, 'business'),
      category: record['category'],
      categoryName: this.getExpandedText(record, 'category'),
      name: record['name'],
      slug: record['slug'],
      description: record['description'],
      image: this.resolveImage(record, 'image'),
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

  private async getDashboardProductRecords(): Promise<ListResult<RecordModel>> {
    try {
      return await this.pb.collection(this.collectionName).getList(1, 200, {
        sort: '-updated',
        requestKey: null
      });
    } catch {
      return this.pb.collection(this.collectionName).getList(1, 200, {
        requestKey: null
      });
    }
  }

  private async resolveProductRelations(products: DalePuesProduct[]): Promise<void> {
    const businessNames = await this.getRelationNameMap('businesses', products.map((product) => product.business));
    const categoryNames = await this.getRelationNameMap('categories', products.map((product) => product.category));

    products.forEach((product) => {
      product.businessName = product.business ? businessNames.get(product.business) || '' : '';
      product.categoryName = product.category ? categoryNames.get(product.category) || '' : '';
    });
  }

  private async getRelationNameMap(collectionName: string, ids: Array<string | undefined>): Promise<Map<string, string>> {
    const uniqueIds = Array.from(new Set(ids.filter((id): id is string => typeof id === 'string' && id.length > 0)));
    const entries = await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const record = await this.pb.collection(collectionName).getOne(id, { requestKey: null });
          const name = record['name'];
          return typeof name === 'string' ? ([id, name] as const) : null;
        } catch {
          return null;
        }
      })
    );

    return new Map(entries.filter((entry): entry is readonly [string, string] => entry !== null));
  }
}
