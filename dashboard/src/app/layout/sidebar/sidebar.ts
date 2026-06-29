import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandingService } from '../../core/services/branding.service';
import { SettingsService } from '../../core/services/settings.service';
import { AppSettings } from '../../models/dale-pues.models';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './sidebar.html',
  styles: [
    ':host { display: contents; }',
    `
      .menu-status {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 8px;
        border-radius: 50%;
        vertical-align: middle;
        flex: 0 0 8px;
      }

      .menu-status.completed {
        background: #22c55e;
      }

      .menu-status.pending {
        background: #ffffff;
        border: 1px solid rgba(33, 37, 41, 0.35);
      }
    `
  ]
})
export class SidebarComponent {
  private readonly branding = inject(BrandingService);
  private readonly settings = inject(SettingsService);

  readonly branding$ = this.branding.branding$;

  getLogoHorizontalUrl(settings: AppSettings | null): string {
    return this.settings.getLogoHorizontalUrl(settings);
  }

  getLogoSquareUrl(settings: AppSettings | null): string {
    return this.settings.getLogoSquareUrl(settings);
  }
}
