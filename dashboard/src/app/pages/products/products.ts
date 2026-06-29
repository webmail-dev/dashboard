import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { DalePuesAdminDataService } from '../../core/services/dale-pues-admin-data.service';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';
import { DalePuesProduct } from '../../models/dale-pues.models';

@Component({
  selector: 'app-products-page',
  imports: [FooterComponent],
  templateUrl: './products.html',
  styles: [':host { display: contents; }']
})
export class ProductsPageComponent implements AfterViewInit {
  private readonly adminData = inject(DalePuesAdminDataService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scripts = inject(ScriptLoaderService);
  products: DalePuesProduct[] = [];
  loading = false;
  error = '';

  async ngAfterViewInit(): Promise<void> {
    await this.loadProducts();
    await this.scripts.loadTemplateScripts(this.scripts.productsPageScripts);
  }

  formatPrice(product: DalePuesProduct): string {
    return `${product.currency || '$'}${product.price.toFixed(2)}`;
  }

  private async loadProducts(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      this.products = await this.adminData.getProducts();
    } catch (error) {
      this.products = [];
      this.error = this.parseError(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private parseError(error: unknown): string {
    return error instanceof Error ? error.message : 'No fue posible cargar productos.';
  }
}
