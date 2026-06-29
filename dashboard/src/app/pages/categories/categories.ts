import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
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
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scripts = inject(ScriptLoaderService);
  categories: DalePuesCategory[] = [];
  loading = false;
  error = '';

  async ngAfterViewInit(): Promise<void> {
    await this.loadCategories();
    await this.scripts.loadTemplateScripts(this.scripts.categoriesPageScripts);
  }

  private async loadCategories(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      this.categories = await this.adminData.getCategories();
    } catch (error) {
      this.categories = [];
      this.error = this.parseError(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private parseError(error: unknown): string {
    return error instanceof Error ? error.message : 'No fue posible cargar categorias.';
  }
}
