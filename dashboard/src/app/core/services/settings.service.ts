import { Injectable, inject } from '@angular/core';
import { RecordModel } from 'pocketbase';
import { AppSettings, AppSettingsFiles, AppSettingsPayload } from '../../models/dale-pues.models';
import { PocketbaseService } from './pocketbase.service';

const DEFAULT_SETTINGS: AppSettingsPayload = {
  key: 'default',
  appName: 'Dale Pues',
  slogan: 'Delivery rápido y confiable',
  primaryColor: '#FF7A00',
  secondaryColor: '#1B1D2A',
  accentColor: '#FFD700',
  country: 'Venezuela',
  currency: 'VES',
  timezone: 'America/Caracas',
  maintenanceMode: false,
  active: true
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly pb = inject(PocketbaseService).getInstance();
  private readonly collectionName = 'app_settings';

  async getSettings(): Promise<AppSettings> {
    const record = await this.pb.collection(this.collectionName).getFirstListItem('key = "default"');
    return this.mapRecord(record);
  }

  async ensureDefaultSettings(): Promise<AppSettings> {
    try {
      return await this.getSettings();
    } catch {
      const record = await this.pb.collection(this.collectionName).create(DEFAULT_SETTINGS);
      return this.mapRecord(record);
    }
  }

  async updateSettings(data: AppSettingsPayload): Promise<AppSettings> {
    const current = await this.ensureDefaultSettings();
    const record = await this.pb.collection(this.collectionName).update(current.id || '', this.cleanPayload(data));
    return this.mapRecord(record);
  }

  async updateSettingsWithFiles(data: AppSettingsPayload, files: AppSettingsFiles = {}): Promise<AppSettings> {
    const current = await this.ensureDefaultSettings();
    const formData = new FormData();

    Object.entries(this.cleanPayload(data)).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (files.logoHorizontal) {
      formData.append('logoHorizontal', files.logoHorizontal);
    }

    if (files.logoSquare) {
      formData.append('logoSquare', files.logoSquare);
    }

    const record = await this.pb.collection(this.collectionName).update(current.id || '', formData);
    return this.mapRecord(record);
  }

  getLogoHorizontalUrl(settings: AppSettings | null | undefined): string {
    return this.getFileUrl(settings, settings?.logoHorizontal) || 'assets/dashboard/images/logo/full-white.svg';
  }

  getLogoSquareUrl(settings: AppSettings | null | undefined): string {
    return this.getFileUrl(settings, settings?.logoSquare) || 'assets/dashboard/images/logo/logo.png';
  }

  private cleanPayload(data: AppSettingsPayload): AppSettingsPayload {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== null)
    ) as AppSettingsPayload;
  }

  private getFileUrl(settings: AppSettings | null | undefined, filename: string | undefined): string {
    if (!settings || !filename) {
      return '';
    }

    if (filename.startsWith('http') || filename.startsWith('assets/')) {
      return filename;
    }

    const record = {
      ...settings,
      collectionId: settings.collectionId || this.collectionName,
      collectionName: settings.collectionName || this.collectionName
    } as unknown as RecordModel;

    return this.pb.files.getURL(record, filename);
  }

  private mapRecord(record: RecordModel): AppSettings {
    return {
      id: record.id,
      collectionId: record.collectionId,
      collectionName: record.collectionName,
      key: record['key'],
      appName: record['appName'],
      slogan: record['slogan'],
      logoHorizontal: record['logoHorizontal'],
      logoSquare: record['logoSquare'],
      primaryColor: record['primaryColor'],
      secondaryColor: record['secondaryColor'],
      accentColor: record['accentColor'],
      supportEmail: record['supportEmail'],
      supportPhone: record['supportPhone'],
      websiteUrl: record['websiteUrl'],
      country: record['country'],
      currency: record['currency'],
      timezone: record['timezone'],
      maintenanceMode: record['maintenanceMode'],
      active: record['active'],
      created: record['created'],
      updated: record['updated']
    };
  }
}
