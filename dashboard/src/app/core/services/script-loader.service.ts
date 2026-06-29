import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  private loadedScripts = new Set<string>();

  readonly commonScripts = [
    'assets/dashboard/js/jquery-3.6.0.min.js',
    'assets/dashboard/js/bootstrap/bootstrap.bundle.min.js',
    'assets/dashboard/js/icons/feather-icon/feather.min.js',
    'assets/dashboard/js/icons/feather-icon/feather-icon.js',
    'assets/dashboard/js/scrollbar/simplebar.js',
    'assets/dashboard/js/scrollbar/custom.js',
    'assets/dashboard/js/config.js',
    'assets/dashboard/js/sidebar-menu.js',
    'assets/dashboard/js/customizer.js',
    'assets/dashboard/js/script.js'
  ];

  readonly dataTableScripts = [
    'assets/dashboard/js/jquery.dataTables.js',
    'assets/dashboard/js/custom-data-table.js'
  ];

  readonly dashboardScripts = [
    'assets/dashboard/js/tooltip-init.js',
    'assets/dashboard/js/chart/apex-chart/apex-chart1.js',
    'assets/dashboard/js/chart/apex-chart/moment.min.js',
    'assets/dashboard/js/chart/apex-chart/apex-chart.js',
    'assets/dashboard/js/chart/apex-chart/stock-prices.js',
    'assets/dashboard/js/chart/apex-chart/chart-custom1.js',
    'assets/dashboard/js/swiper-bundle.min.js',
    'assets/dashboard/js/custom-swiper.js',
    'assets/dashboard/js/ratio.js'
  ];

  loadScripts(scripts: string[]): Promise<void[]> {
    return Promise.all(scripts.map((src) => this.loadScript(src)));
  }

  loadTemplateScripts(scripts: string[] = []): Promise<void[]> {
    return this.loadScripts([...this.commonScripts, ...scripts]).then((result) => {
      this.refreshTemplateDom();
      return result;
    });
  }

  refreshTemplateDom(): void {
    const win = window as any;
    win.feather?.replace?.();

    const $ = win.jQuery;
    if (!$) return;

    $('.loader-wrapper').fadeOut('slow');

    if ($('#table_id').length && $.fn?.DataTable && !$.fn.DataTable.isDataTable('#table_id')) {
      $('#table_id').DataTable();
    }

    $('#checkall').off('change.angular-template').on('change.angular-template', function (this: HTMLElement) {
      const checked = $(this).is(':checked');
      $('.custom-checkbox').prop('checked', checked);
    });
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
