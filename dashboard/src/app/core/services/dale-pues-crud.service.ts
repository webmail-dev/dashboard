import { inject } from '@angular/core';
import { ListResult, RecordListOptions, RecordModel } from 'pocketbase';
import { FileInput } from '../../models/dale-pues.models';
import { PocketbaseService } from './pocketbase.service';

export interface DalePuesListOptions {
  page?: number;
  perPage?: number;
  sort?: string;
  filter?: string;
  expand?: string;
}

type PayloadValue = string | number | boolean | Record<string, unknown> | string[] | number[] | FileInput;
export type DalePuesPayload = Record<string, PayloadValue>;

export abstract class DalePuesCrudService<TRecord, TPayload extends DalePuesPayload = DalePuesPayload> {
  protected readonly pb = inject(PocketbaseService).getInstance();

  protected abstract readonly collectionName: string;
  protected abstract mapRecord(record: RecordModel): TRecord;

  async list(options: DalePuesListOptions = {}): Promise<ListResult<TRecord>> {
    const result = await this.pb.collection(this.collectionName).getList(options.page || 1, options.perPage || 20, {
      ...this.toRecordOptions(options),
      requestKey: null
    });

    return {
      ...result,
      items: result.items.map((record) => this.mapRecord(record))
    };
  }

  async getFullList(options: DalePuesListOptions = {}): Promise<TRecord[]> {
    const records = await this.pb.collection(this.collectionName).getFullList({
      ...this.toRecordOptions(options),
      requestKey: null
    });

    return records.map((record) => this.mapRecord(record));
  }

  async getOne(id: string, options: Pick<DalePuesListOptions, 'expand'> = {}): Promise<TRecord> {
    const record = await this.pb.collection(this.collectionName).getOne(id, {
      expand: options.expand,
      requestKey: null
    });

    return this.mapRecord(record);
  }

  async create(payload: TPayload): Promise<TRecord> {
    const record = await this.pb.collection(this.collectionName).create(this.toBody(payload));
    return this.mapRecord(record);
  }

  async update(id: string, payload: TPayload): Promise<TRecord> {
    const record = await this.pb.collection(this.collectionName).update(id, this.toBody(payload));
    return this.mapRecord(record);
  }

  async delete(id: string): Promise<boolean> {
    return this.pb.collection(this.collectionName).delete(id);
  }

  async setActive(id: string, active: boolean): Promise<TRecord> {
    return this.update(id, { active } as unknown as TPayload);
  }

  count(filter?: string): Promise<number> {
    return this.pb
      .collection(this.collectionName)
      .getList(1, 1, { filter, requestKey: null })
      .then((result) => result.totalItems)
      .catch(() => 0);
  }

  protected getImageUrl(record: RecordModel, fieldName: string): string {
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

  protected toBody(payload: TPayload): FormData | TPayload {
    const hasFile = Object.values(payload).some((value) => value instanceof Blob);

    if (!hasFile) {
      return payload;
    }

    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (value instanceof Blob) {
        form.append(key, value);
        return;
      }

      if (typeof value === 'object') {
        form.append(key, JSON.stringify(value));
        return;
      }

      form.append(key, String(value));
    });

    return form;
  }

  private toRecordOptions(options: DalePuesListOptions): RecordListOptions {
    return {
      filter: options.filter,
      sort: options.sort,
      expand: options.expand
    };
  }
}
