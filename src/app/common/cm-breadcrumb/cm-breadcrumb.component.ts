import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbRow {
  index?: number;
  parts: string[]; // e.g. ['Config', 'Project Config'] or ['VMS dashboard']
  link?: string; // optional link for the whole row
}

@Component({
  selector: 'app-cm-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cm-breadcrumb.component.html',
  styleUrls: ['./cm-breadcrumb.component.css']
})
export class CmBreadcrumbComponent {
  @Input() rows: BreadcrumbRow[] = [];

  @Input('breadcrumbItems')
  set breadcrumbItems(items: BreadcrumbRow[] | undefined) {
    if (items) {
      this.rows = items;
    }
  }
  
  @Input('breadcrumbs')
  set breadcrumbs(items: BreadcrumbRow[] | undefined) {
    if (items) {
      this.rows = items;
    }
  }
}
