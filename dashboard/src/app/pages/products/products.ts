import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';

@Component({
  selector: 'app-products-page',
  imports: [RouterLink, FooterComponent],
  templateUrl: './products.html'
})
export class ProductsPageComponent implements AfterViewInit {
  private readonly scripts = inject(ScriptLoaderService);

  ngAfterViewInit(): void {
    void this.scripts.loadTemplateScripts(this.scripts.dataTableScripts);
  }
}
