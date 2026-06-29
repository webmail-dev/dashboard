import { Injectable } from '@angular/core';
import { RecordModel } from 'pocketbase';
import {
  ContentSection,
  DalePuesPromotion,
  DalePuesPromotionPayload
} from '../../models/dale-pues.models';
import { DalePuesCrudService } from './dale-pues-crud.service';

@Injectable({ providedIn: 'root' })
export class PromotionsService extends DalePuesCrudService<DalePuesPromotion, DalePuesPromotionPayload> {
  protected readonly collectionName = 'promotions';

  getBySection(section: ContentSection): Promise<DalePuesPromotion[]> {
    return this.getFullList({
      filter: `section = "${section}"`,
      sort: 'order,created',
      expand: 'business,product'
    });
  }

  protected mapRecord(record: RecordModel): DalePuesPromotion {
    return {
      id: record.id,
      title: record['title'],
      description: record['description'],
      business: record['business'],
      businessName: this.getExpandedText(record, 'business'),
      product: record['product'],
      productName: this.getExpandedText(record, 'product'),
      section: record['section'],
      discountType: record['discountType'],
      discountValue: Number(record['discountValue'] || 0),
      badgeText: record['badgeText'],
      image: this.resolveImage(record, 'image'),
      imageUrl: record['imageUrl'],
      active: record['active'],
      startDate: record['startDate'],
      endDate: record['endDate'],
      order: Number(record['order'] || 0),
      created: record['created'],
      updated: record['updated']
    };
  }
}
