import { Injectable } from '@angular/core';
import { RecordModel } from 'pocketbase';
import { DalePuesUser, UserStatus, UserType } from '../../models/auth.models';
import { DalePuesCrudService, DalePuesPayload } from './dale-pues-crud.service';

export type DalePuesUserPayload = Partial<Omit<DalePuesUser, 'id' | 'avatar'>> & {
  avatar?: File | Blob | string | null;
};

@Injectable({ providedIn: 'root' })
export class UsersService extends DalePuesCrudService<DalePuesUser, DalePuesUserPayload & DalePuesPayload> {
  protected readonly collectionName = 'users';

  getByType(type: UserType): Promise<DalePuesUser[]> {
    return this.getFullList({
      filter: `type = "${type}"`,
      sort: '-updated'
    });
  }

  getCouriers(): Promise<DalePuesUser[]> {
    return this.getByType('courier');
  }

  updateStatus(id: string, status: UserStatus): Promise<DalePuesUser> {
    return this.update(id, { status });
  }

  protected override resolveImage(record: RecordModel, fieldName: string): string {
    const fileUrl = super.resolveImage(record, fieldName);
    if (fileUrl) return fileUrl;

    const value = record[fieldName];
    return typeof value === 'string' ? value : '';
  }

  protected mapRecord(record: RecordModel): DalePuesUser {
    return {
      id: record.id,
      email: record['email'],
      name: record['name'],
      phone: record['phone'],
      type: record['type'],
      status: record['status'],
      avatar: this.resolveImage(record, 'avatar'),
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
    };
  }
}
