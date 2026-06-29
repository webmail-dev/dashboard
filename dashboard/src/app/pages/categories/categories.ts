import { AfterViewInit, Component, inject } from '@angular/core';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';

@Component({
  selector: 'app-categories-page',
  imports: [FooterComponent],
  templateUrl: './categories.html',
  styles: [':host { display: contents; }']
})
export class CategoriesPageComponent implements AfterViewInit {
  private readonly scripts = inject(ScriptLoaderService);

  ngAfterViewInit(): void {
    void this.scripts.loadTemplateScripts(this.scripts.categoriesPageScripts);
  }
}
