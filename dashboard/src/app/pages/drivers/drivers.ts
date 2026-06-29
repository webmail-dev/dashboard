import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { DalePuesAdminDataService } from '../../core/services/dale-pues-admin-data.service';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';
import { DalePuesUser } from '../../models/auth.models';

@Component({
  selector: 'app-drivers-page',
  imports: [FooterComponent],
  templateUrl: './drivers.html',
  styles: [':host { display: contents; }']
})
export class DriversPageComponent implements AfterViewInit {
  private readonly adminData = inject(DalePuesAdminDataService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scripts = inject(ScriptLoaderService);
  drivers: DalePuesUser[] = [];
  loading = false;
  error = '';

  async ngAfterViewInit(): Promise<void> {
    await this.loadDrivers();
    await this.scripts.loadTemplateScripts(this.scripts.usersPageScripts);
  }

  formatIndex(index: number): string {
    return `${index + 1}`.padStart(2, '0');
  }

  private async loadDrivers(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      this.drivers = await this.adminData.getCouriers();
    } catch (error) {
      this.drivers = [];
      this.error = this.parseError(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private parseError(error: unknown): string {
    return error instanceof Error ? error.message : 'No fue posible cargar conductores.';
  }
}
