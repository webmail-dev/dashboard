import { Injectable } from '@angular/core';
import { RecordModel } from 'pocketbase';
import {
  ContentSection,
  DalePuesBanner,
  DalePuesBannerPayload
} from '../../models/dale-pues.models';
import { DalePuesCrudService } from './dale-pues-crud.service';

@Injectable({ providedIn: 'root' })
export class BannersService extends DalePuesCrudService<DalePuesBanner, DalePuesBannerPayload> {
  protected readonly collectionName = 'banners';

  getBySection(section: ContentSection): Promise<DalePuesBanner[]> {
    return this.getFullList({
      filter: `section = "${section}"`,
      sort: 'position,created'
    });
  }

  protected mapRecord(record: RecordModel): DalePuesBanner {
    return {
      id: record.id,
      title: record['title'],
      subtitle: record['subtitle'],
      highlight: record['highlight'],
      image: this.getImageUrl(record, 'image'),
      imageUrl: record['imageUrl'],
      alt: record['alt'],
      ctaText: record['ctaText'],
      link: record['link'],
      section: record['section'],
      position: Number(record['position'] || 0),
      active: record['active'],
      startDate: record['startDate'],
      endDate: record['endDate'],
      created: record['created'],
      updated: record['updated']
    };
  }
}
