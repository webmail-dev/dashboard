import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { DalePuesAdminDataService } from '../../core/services/dale-pues-admin-data.service';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';
import { DalePuesBusiness } from '../../models/dale-pues.models';

@Component({
  selector: 'app-restaurants-page',
  imports: [FooterComponent],
  templateUrl: './restaurants.html',
  styles: [':host { display: contents; }']
})
export class RestaurantsPageComponent implements AfterViewInit {
  private readonly adminData = inject(DalePuesAdminDataService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scripts = inject(ScriptLoaderService);
  restaurants: DalePuesBusiness[] = [];
  loading = false;
  error = '';

  async ngAfterViewInit(): Promise<void> {
    await this.loadRestaurants();
    await this.scripts.loadTemplateScripts(this.scripts.productsPageScripts);
  }

  formatRating(restaurant: DalePuesBusiness): string {
    return (restaurant.rating || 0).toFixed(1);
  }

  private async loadRestaurants(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      this.restaurants = await this.adminData.getRestaurants();
    } catch (error) {
      this.restaurants = [];
      this.error = this.parseError(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private parseError(error: unknown): string {
    return error instanceof Error ? error.message : 'No fue posible cargar restaurantes.';
  }
}
