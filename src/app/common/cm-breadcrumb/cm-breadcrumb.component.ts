import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CmSelectCheckComponent } from '../cm-select-check/cm-select-check.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'; 

export interface BreadcrumbRow {
  index?: number;
  parts: string[]; // e.g. ['Config', 'Project Config'] or ['VMS dashboard']
  link?: string; // optional link for the whole row
}

@Component({
  selector: 'app-cm-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule,MatButtonToggleModule,MatDatepickerModule,CmSelectCheckComponent,  MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule,MatTooltipModule, FormsModule],
  templateUrl: './cm-breadcrumb.component.html',
  styleUrls: ['./cm-breadcrumb.component.css']
})
export class CmBreadcrumbComponent {
  @Input() rows: BreadcrumbRow[] = [];
startDate:any;
endDate:any;

  // Zone Inputs/Outputs
  @Input() zoneOptions: any[] = [];
  @Input() selectedZones: any[] = [];
  @Output() zoneSelectionChange = new EventEmitter<any>();
  @Output() configClear = new EventEmitter<void>();
  @Output() dateChange = new EventEmitter<{value: any, category: string}>();

  onZoneChange(event: any) {
    this.zoneSelectionChange.emit(event);
  }

  clearActions() {
      this.configClear.emit();
  }

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

  DateWiseFilter(evtData: any, category: string) {
  const localDate = new Date(evtData.value);

  // Convert date to UTC explicitly
  const utcDate = new Date(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
    localDate.getUTCMinutes(),
    localDate.getUTCSeconds()
  );

  // Convert to Unix UTC timestamp in milliseconds (13 digits)
  const unixUtcMs = utcDate.getTime();  // 💥 No /1000 here

  if (category === "start") {
    this.startDate = unixUtcMs;
    console.log("Start Date UTC UNIX (ms):", unixUtcMs);
  } else {
    this.endDate = unixUtcMs;
    console.log("End Date UTC UNIX (ms):", unixUtcMs);
  }

  //this.GetOngoingAnnoucement();
}
}
