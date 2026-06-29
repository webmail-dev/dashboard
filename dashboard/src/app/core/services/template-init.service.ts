import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TemplateInitService {
  init(): void {
    setTimeout(() => {
      this.replaceFeatherIcons();
      this.initSidebarState();
      this.initDataTables();
      this.initCheckboxes();
      this.initSwipers();
      this.hideLoader();
    }, 0);
  }

  private replaceFeatherIcons(): void {
    const win = window as any;
    win.feather?.replace?.();
  }

  private initSidebarState(): void {
    const win = window as any;
    const $ = win.jQuery;
    if (!$) return;

    $('.sidebar-title .according-menu').remove();
    $('.sidebar-title').each(function (this: HTMLElement) {
      if ($(this).next('.sidebar-submenu, .menu-content').length) {
        $(this).append('<div class="according-menu"><i class="ri-arrow-right-s-line"></i></div>');
      }
    });

    $('.sidebar-wrapper nav a').removeClass('active');
    $('.sidebar-wrapper nav li').removeClass('active');

    const currentPath = window.location.pathname || '/dashboard';
    $('.sidebar-wrapper nav ul>li a').each(function (this: HTMLAnchorElement) {
      const href = this.getAttribute('href');
      if (!href || href === 'javascript:void(0)') return;

      const url = new URL(href, window.location.origin);
      if (url.pathname === currentPath) {
        $(this).addClass('active');
        $(this).parents('li').addClass('active');
        $(this).parents('ul.sidebar-submenu').show();
        $(this)
          .closest('ul.sidebar-submenu')
          .prev('.sidebar-title')
          .addClass('active')
          .find('.according-menu')
          .replaceWith('<div class="according-menu"><i class="ri-arrow-down-s-line"></i></div>');
      }
    });
  }

  private initDataTables(): void {
    const win = window as any;
    const $ = win.jQuery;
    if (!$ || !$.fn?.DataTable || !$('#table_id').length) return;

    if (!$.fn.DataTable.isDataTable('#table_id')) {
      $('#table_id').DataTable();
    }
  }

  private initCheckboxes(): void {
    const win = window as any;
    const $ = win.jQuery;
    if (!$) return;

    $('#checkall').off('change.angular-template').on('change.angular-template', function (this: HTMLElement) {
      const checked = $(this).is(':checked');
      $('.custom-checkbox').prop('checked', checked);
    });
  }

  private initSwipers(): void {
    const win = window as any;
    if (!win.Swiper) return;

    document.querySelectorAll('.categories-slider:not(.swiper-initialized)').forEach((element) => {
      new win.Swiper(element, {
        slidesPerView: 8,
        spaceBetween: 10,
        loop: true,
        navigation: {
          nextEl: '.categories-next',
          prevEl: '.categories-prev'
        },
        breakpoints: {
          0: { slidesPerView: 2, spaceBetween: 10 },
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1300: { slidesPerView: 5, spaceBetween: 15 },
          1400: { slidesPerView: 6 },
          1550: { slidesPerView: 7 },
          1600: { slidesPerView: 8, spaceBetween: 20 }
        }
      });
    });

    document.querySelectorAll('.trending-slider:not(.swiper-initialized)').forEach((element) => {
      new win.Swiper(element, {
        slidesPerView: 5,
        spaceBetween: 30,
        loop: true,
        navigation: {
          nextEl: '.categories-next',
          prevEl: '.categories-prev'
        },
        breakpoints: {
          0: { slidesPerView: 1, spaceBetween: 10 },
          500: { slidesPerView: 2 },
          840: { slidesPerView: 3 },
          1200: { slidesPerView: 3, spaceBetween: 15 },
          1400: { slidesPerView: 4 },
          1600: { slidesPerView: 5, spaceBetween: 20 }
        }
      });
    });
  }

  private hideLoader(): void {
    const win = window as any;
    const $ = win.jQuery;
    if ($) {
      $('.loader-wrapper').fadeOut('slow');
      return;
    }

    document.querySelector<HTMLElement>('.loader-wrapper')?.style.setProperty('display', 'none');
  }
}
