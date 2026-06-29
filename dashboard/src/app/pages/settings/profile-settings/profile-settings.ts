import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandingService } from '../../../core/services/branding.service';
import { SettingsService } from '../../../core/services/settings.service';
import { FooterComponent } from '../../../layout/footer/footer';
import { AppSettings, AppSettingsFiles, AppSettingsPayload } from '../../../models/dale-pues.models';

@Component({
  selector: 'app-profile-settings-page',
  imports: [ReactiveFormsModule, FooterComponent],
  templateUrl: './profile-settings.html',
  styles: [
    ':host { display: contents; }',
    `
      .branding-preview {
        display: flex;
        min-height: 110px;
        align-items: center;
        justify-content: center;
        padding: 16px;
        border: 1px dashed rgba(33, 37, 41, 0.25);
        border-radius: 8px;
        background: #f8f9fa;
      }

      .branding-preview.horizontal img {
        max-width: 260px;
        max-height: 80px;
      }

      .branding-preview.square img {
        max-width: 96px;
        max-height: 96px;
      }

      .color-control {
        min-height: 48px;
        padding: 6px;
      }
    `
  ]
})
export class ProfileSettingsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly settings = inject(SettingsService);
  private readonly branding = inject(BrandingService);
  private readonly cdr = inject(ChangeDetectorRef);

  settingsRecord: AppSettings | null = null;
  loading = false;
  saving = false;
  error = '';
  success = '';
  logoHorizontalPreview = this.settings.getLogoHorizontalUrl(null);
  logoSquarePreview = this.settings.getLogoSquareUrl(null);

  private files: AppSettingsFiles = {};

  readonly form = this.fb.nonNullable.group({
    appName: ['', [Validators.required, Validators.maxLength(160)]],
    slogan: ['', [Validators.maxLength(255)]],
    primaryColor: ['#FF7A00', [Validators.pattern(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/)]],
    secondaryColor: ['#1B1D2A', [Validators.pattern(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/)]],
    accentColor: ['#FFD700', [Validators.pattern(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/)]],
    supportEmail: ['', [Validators.email]],
    supportPhone: ['', [Validators.maxLength(40)]],
    websiteUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    country: ['Venezuela', [Validators.maxLength(80)]],
    currency: ['VES', [Validators.maxLength(12)]],
    timezone: ['America/Caracas', [Validators.maxLength(80)]],
    maintenanceMode: [false],
    active: [true]
  });

  async ngOnInit(): Promise<void> {
    await this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.cdr.detectChanges();

    try {
      this.settingsRecord = await this.settings.ensureDefaultSettings();
      this.patchForm(this.settingsRecord);
      this.logoHorizontalPreview = this.settings.getLogoHorizontalUrl(this.settingsRecord);
      this.logoSquarePreview = this.settings.getLogoSquareUrl(this.settingsRecord);
    } catch (error) {
      this.error = this.parseError(error, 'No fue posible cargar los ajustes de branding.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onFileChange(event: Event, field: keyof AppSettingsFiles): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.files[field] = file;

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (field === 'logoHorizontal') {
      this.logoHorizontalPreview = previewUrl;
    } else {
      this.logoSquarePreview = previewUrl;
    }
  }

  async saveSettings(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Revisa los campos marcados antes de guardar.';
      this.cdr.detectChanges();
      return;
    }

    this.saving = true;
    this.error = '';
    this.success = '';
    this.cdr.detectChanges();

    try {
      const payload: AppSettingsPayload = {
        key: this.settingsRecord?.key || 'default',
        ...this.form.getRawValue()
      };

      this.settingsRecord = await this.settings.updateSettingsWithFiles(payload, this.files);
      this.files = {};
      this.logoHorizontalPreview = this.settings.getLogoHorizontalUrl(this.settingsRecord);
      this.logoSquarePreview = this.settings.getLogoSquareUrl(this.settingsRecord);
      await this.branding.refreshBranding();
      this.success = 'Ajustes guardados correctamente.';
    } catch (error) {
      this.error = this.parseError(error, 'No fue posible guardar los ajustes.');
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  hasError(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  private patchForm(settings: AppSettings): void {
    this.form.patchValue({
      appName: settings.appName || 'Dale Pues',
      slogan: settings.slogan || '',
      primaryColor: settings.primaryColor || '#FF7A00',
      secondaryColor: settings.secondaryColor || '#1B1D2A',
      accentColor: settings.accentColor || '#FFD700',
      supportEmail: settings.supportEmail || '',
      supportPhone: settings.supportPhone || '',
      websiteUrl: settings.websiteUrl || '',
      country: settings.country || 'Venezuela',
      currency: settings.currency || 'VES',
      timezone: settings.timezone || 'America/Caracas',
      maintenanceMode: Boolean(settings.maintenanceMode),
      active: settings.active !== false
    });
  }

  private parseError(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
