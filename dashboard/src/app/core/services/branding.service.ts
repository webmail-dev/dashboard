import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppSettings } from '../../models/dale-pues.models';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class BrandingService {
  private readonly settings = inject(SettingsService);

  readonly branding$ = new BehaviorSubject<AppSettings | null>(null);

  async loadBranding(): Promise<AppSettings | null> {
    try {
      const branding = await this.settings.ensureDefaultSettings();
      this.branding$.next(branding);
      this.applyCssVariables(branding);
      return branding;
    } catch {
      this.branding$.next(null);
      return null;
    }
  }

  refreshBranding(): Promise<AppSettings | null> {
    return this.loadBranding();
  }

  private applyCssVariables(branding: AppSettings): void {
    const root = document.documentElement;

    if (branding.primaryColor) {
      root.style.setProperty('--dale-primary-color', branding.primaryColor);
    }

    if (branding.secondaryColor) {
      root.style.setProperty('--dale-secondary-color', branding.secondaryColor);
    }

    if (branding.accentColor) {
      root.style.setProperty('--dale-accent-color', branding.accentColor);
    }
  }
}
