import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { DalePuesAdminDataService } from '../../core/services/dale-pues-admin-data.service';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';
import { DalePuesBusiness } from '../../models/dale-pues.models';

@Component({
  selector: 'app-businesses-page',
  imports: [FooterComponent],
  templateUrl: './businesses.html',
  styles: [':host { display: contents; }']
})
export class BusinessesPageComponent implements AfterViewInit {
  private readonly adminData = inject(DalePuesAdminDataService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scripts = inject(ScriptLoaderService);
  businesses: DalePuesBusiness[] = [];
  loading = false;
  error = '';

  async ngAfterViewInit(): Promise<void> {
    await this.loadBusinesses();
    await this.scripts.loadTemplateScripts(this.scripts.productsPageScripts);
  }

  formatRating(business: DalePuesBusiness): string {
    return (business.rating || 0).toFixed(1);
  }

  private async loadBusinesses(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      this.businesses = await this.adminData.getBusinesses();
    } catch (error) {
      this.businesses = [];
      this.error = this.parseError(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private parseError(error: unknown): string {
    return error instanceof Error ? error.message : 'No fue posible cargar negocios.';
  }
}
