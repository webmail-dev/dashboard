import { Injectable } from '@angular/core';
import { RecordModel } from 'pocketbase';
import {
  ContentSection,
  DalePuesCategory,
  DalePuesCategoryPayload
} from '../../models/dale-pues.models';
import { DalePuesCrudService } from './dale-pues-crud.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService extends DalePuesCrudService<DalePuesCategory, DalePuesCategoryPayload> {
  protected readonly collectionName = 'categories';

  getBySection(type: ContentSection): Promise<DalePuesCategory[]> {
    return this.getFullList({
      filter: `type = "${type}"`,
      sort: 'order,name'
    });
  }

  protected mapRecord(record: RecordModel): DalePuesCategory {
    return {
      id: record.id,
      name: record['name'],
      slug: record['slug'],
      type: record['type'],
      image: this.resolveImage(record, 'image'),
      imageUrl: record['imageUrl'],
      icon: record['icon'],
      alt: record['alt'],
      link: record['link'],
      active: record['active'],
      order: record['order'],
      created: record['created'],
      updated: record['updated']
    };
  }
}
