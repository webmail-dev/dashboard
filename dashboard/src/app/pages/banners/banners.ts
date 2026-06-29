import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { DalePuesAdminDataService } from '../../core/services/dale-pues-admin-data.service';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';
import { DalePuesBanner } from '../../models/dale-pues.models';

@Component({
  selector: 'app-banners-page',
  imports: [FooterComponent],
  templateUrl: './banners.html',
  styles: [':host { display: contents; }']
})
export class BannersPageComponent implements AfterViewInit {
  private readonly adminData = inject(DalePuesAdminDataService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scripts = inject(ScriptLoaderService);
  banners: DalePuesBanner[] = [];
  loading = false;
  error = '';

  async ngAfterViewInit(): Promise<void> {
    await this.loadBanners();
    await this.scripts.loadTemplateScripts(this.scripts.productsPageScripts);
  }

  private async loadBanners(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      this.banners = await this.adminData.getBanners();
    } catch (error) {
      this.banners = [];
      this.error = this.parseError(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private parseError(error: unknown): string {
    return error instanceof Error ? error.message : 'No fue posible cargar banners.';
  }
}
