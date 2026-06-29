import { Injectable } from '@angular/core';
import { TemplateInitService } from './template-init.service';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  private loadedScripts = new Set<string>();

  constructor(private readonly templateInit: TemplateInitService) {}

  readonly baseScripts = [
    'assets/dashboard/js/jquery-3.6.0.min.js',
    'assets/dashboard/js/bootstrap/bootstrap.bundle.min.js',
    'assets/dashboard/js/icons/feather-icon/feather.min.js',
    'assets/dashboard/js/icons/feather-icon/feather-icon.js',
    'assets/dashboard/js/scrollbar/simplebar.js',
    'assets/dashboard/js/scrollbar/custom.js'
  ];

  readonly dashboardPageScripts = [
    ...this.baseScripts,
    'assets/dashboard/js/config.js',
    'assets/dashboard/js/tooltip-init.js',
    'assets/dashboard/js/sidebar-menu.js',
    'assets/dashboard/js/chart/apex-chart/apex-chart1.js',
    'assets/dashboard/js/chart/apex-chart/moment.min.js',
    'assets/dashboard/js/chart/apex-chart/apex-chart.js',
    'assets/dashboard/js/chart/apex-chart/stock-prices.js',
    'assets/dashboard/js/chart/apex-chart/chart-custom1.js',
    'assets/dashboard/js/swiper-bundle.min.js',
    'assets/dashboard/js/custom-swiper.js',
    'assets/dashboard/js/customizer.js',
    'assets/dashboard/js/ratio.js',
    'assets/dashboard/js/script.js'
  ];

  readonly productsPageScripts = [
    ...this.baseScripts,
    'assets/dashboard/js/config.js',
    'assets/dashboard/js/customizer.js',
    'assets/dashboard/js/sidebar-menu.js',
    'assets/dashboard/js/jquery.dataTables.js',
    'assets/dashboard/js/custom-data-table.js',
    'assets/dashboard/js/script.js'
  ];

  readonly categoriesPageScripts = [
    ...this.baseScripts,
    'assets/dashboard/js/customizer.js',
    'assets/dashboard/js/config.js',
    'assets/dashboard/js/sidebar-menu.js',
    'assets/dashboard/js/jquery.dataTables.js',
    'assets/dashboard/js/custom-data-table.js',
    'assets/dashboard/js/script.js'
  ];

  readonly usersPageScripts = [
    ...this.baseScripts,
    'assets/dashboard/js/customizer.js',
    'assets/dashboard/js/config.js',
    'assets/dashboard/js/sidebar-menu.js',
    'assets/dashboard/js/jquery.dataTables.js',
    'assets/dashboard/js/custom-data-table.js',
    'assets/dashboard/js/checkbox-all-check.js',
    'assets/dashboard/js/script.js'
  ];

  loadScripts(scripts: string[]): Promise<void[]> {
    const loaded: void[] = [];

    return scripts
      .reduce(
        (chain, src) =>
          chain.then(() =>
            this.loadScript(src).then((result) => {
              loaded.push(result);
            })
          ),
        Promise.resolve()
      )
      .then(() => loaded);
  }

  loadTemplateScripts(scripts: string[]): Promise<void[]> {
    return this.loadScripts(scripts).then((result) => {
      this.refreshTemplateDom();
      return result;
    });
  }

  refreshTemplateDom(): void {
    this.templateInit.init();
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts.has(src)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        this.loadedScripts.add(src);
        resolve();
      };
      script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
      document.body.appendChild(script);
    });
  }
}
