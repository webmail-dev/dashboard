import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { DalePuesAdminDataService } from '../../core/services/dale-pues-admin-data.service';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';
import { DalePuesPromotion } from '../../models/dale-pues.models';

@Component({
  selector: 'app-promotions-page',
  imports: [FooterComponent],
  templateUrl: './promotions.html',
  styles: [':host { display: contents; }']
})
export class PromotionsPageComponent implements AfterViewInit {
  private readonly adminData = inject(DalePuesAdminDataService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scripts = inject(ScriptLoaderService);
  promotions: DalePuesPromotion[] = [];
  loading = false;
  error = '';

  async ngAfterViewInit(): Promise<void> {
    await this.loadPromotions();
    await this.scripts.loadTemplateScripts(this.scripts.productsPageScripts);
  }

  formatDiscount(promotion: DalePuesPromotion): string {
    if (promotion.discountType === 'percentage') return `${promotion.discountValue || 0}%`;
    if (promotion.discountType === 'fixed') return `${promotion.discountValue || 0}`;
    return promotion.badgeText || promotion.discountType;
  }

  private async loadPromotions(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      this.promotions = await this.adminData.getPromotions();
    } catch (error) {
      this.promotions = [];
      this.error = this.parseError(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private parseError(error: unknown): string {
    return error instanceof Error ? error.message : 'No fue posible cargar promociones.';
  }
}
