import { Injectable } from '@angular/core';
import { RecordModel } from 'pocketbase';
import {
  BusinessType,
  DalePuesBusiness,
  DalePuesBusinessPayload
} from '../../models/dale-pues.models';
import { DalePuesCrudService } from './dale-pues-crud.service';

@Injectable({ providedIn: 'root' })
export class BusinessesService extends DalePuesCrudService<DalePuesBusiness, DalePuesBusinessPayload> {
  protected readonly collectionName = 'businesses';

  getByType(type: BusinessType): Promise<DalePuesBusiness[]> {
    return this.getFullList({
      filter: `type = "${type}"`,
      sort: '-featured,name'
    });
  }

  getRestaurants(): Promise<DalePuesBusiness[]> {
    return this.getByType('restaurant');
  }

  setFeatured(id: string, featured: boolean): Promise<DalePuesBusiness> {
    return this.update(id, { featured });
  }

  protected mapRecord(record: RecordModel): DalePuesBusiness {
    return {
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
    };
  }
}
