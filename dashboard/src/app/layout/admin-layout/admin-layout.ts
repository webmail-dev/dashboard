import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthPocketbaseService } from '../../core/services/auth-pocketbase.service';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './admin-layout.html'
})
export class AdminLayoutComponent implements AfterViewInit {
  private readonly auth = inject(AuthPocketbaseService);
  private readonly scripts = inject(ScriptLoaderService);

  ngAfterViewInit(): void {
    this.scripts.refreshTemplateDom();
  }

  logout(): void {
    this.auth.logout();
  }
}
