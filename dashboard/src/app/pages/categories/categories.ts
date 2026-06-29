import { AfterViewInit, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DalePuesAdminDataService } from '../../core/services/dale-pues-admin-data.service';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';
import { DalePuesCategory } from '../../models/dale-pues.models';

@Component({
  selector: 'app-categories-page',
  imports: [DatePipe, FooterComponent],
  templateUrl: './categories.html',
  styles: [':host { display: contents; }']
})
export class CategoriesPageComponent implements AfterViewInit {
  private readonly adminData = inject(DalePuesAdminDataService);
  private readonly scripts = inject(ScriptLoaderService);
  categories: DalePuesCategory[] = [];

  async ngAfterViewInit(): Promise<void> {
    await this.loadCategories();
    await this.scripts.loadTemplateScripts(this.scripts.categoriesPageScripts);
  }

  private async loadCategories(): Promise<void> {
    this.categories = await this.adminData.getCategories();
  }
}
