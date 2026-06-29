import { AfterViewInit, Component, inject } from '@angular/core';
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
  private readonly scripts = inject(ScriptLoaderService);
  products: DalePuesProduct[] = [];

  async ngAfterViewInit(): Promise<void> {
    await this.loadProducts();
    await this.scripts.loadTemplateScripts(this.scripts.productsPageScripts);
  }

  formatPrice(product: DalePuesProduct): string {
    return `${product.currency || '$'}${product.price.toFixed(2)}`;
  }

  private async loadProducts(): Promise<void> {
    this.products = await this.adminData.getProducts();
  }
}
