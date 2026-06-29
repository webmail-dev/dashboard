import { AfterViewInit, Component, inject } from '@angular/core';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';

@Component({
  selector: 'app-products-page',
  imports: [FooterComponent],
  templateUrl: './products.html',
  styles: [':host { display: contents; }']
})
export class ProductsPageComponent implements AfterViewInit {
  private readonly scripts = inject(ScriptLoaderService);

  ngAfterViewInit(): void {
    void this.scripts.loadTemplateScripts(this.scripts.productsPageScripts);
  }
}
