import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { DalePuesAdminDataService } from '../../core/services/dale-pues-admin-data.service';
import { FooterComponent } from '../../layout/footer/footer';
import { DashboardStats } from '../../models/dale-pues.models';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, FooterComponent],
  templateUrl: './dashboard.html',
  styles: [':host { display: contents; }']
})
export class DashboardPageComponent implements AfterViewInit {
  private readonly adminData = inject(DalePuesAdminDataService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scripts = inject(ScriptLoaderService);
  stats: DashboardStats = {
    categories: 0,
    products: 0,
    restaurants: 0,
    users: 0,
    couriers: 0,
    pendingUsers: 0,
    banners: 0,
    promotions: 0
  };
  loading = false;
  error = '';

  ngAfterViewInit(): void {
    void this.scripts.loadTemplateScripts(this.scripts.dashboardPageScripts);
    void this.loadStats();
  }

  private async loadStats(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      this.stats = await this.adminData.getDashboardStats();
    } catch (error) {
      this.error = this.parseError(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private parseError(error: unknown): string {
    return error instanceof Error ? error.message : 'No fue posible cargar metricas.';
  }
}
