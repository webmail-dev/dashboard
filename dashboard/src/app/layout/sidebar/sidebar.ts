import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styles: [
    ':host { display: contents; }',
    `
      .menu-status {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 8px;
        border-radius: 50%;
        vertical-align: middle;
        flex: 0 0 8px;
      }

      .menu-status.completed {
        background: #22c55e;
      }

      .menu-status.pending {
        background: #ffffff;
        border: 1px solid rgba(33, 37, 41, 0.35);
      }
    `
  ]
})
export class SidebarComponent {}
