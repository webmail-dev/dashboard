import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { FooterComponent } from '../../layout/footer/footer';

@Component({
  selector: 'app-users-page',
  imports: [RouterLink, FooterComponent],
  templateUrl: './users.html'
})
export class UsersPageComponent implements AfterViewInit {
  private readonly scripts = inject(ScriptLoaderService);

  ngAfterViewInit(): void {
    void this.scripts.loadTemplateScripts([...this.scripts.dataTableScripts, 'assets/dashboard/js/checkbox-all-check.js']);
  }
}
