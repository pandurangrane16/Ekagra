import { Component } from '@angular/core';
import { MapviewComponent } from "../dashboard/widgets/mapview/mapview.component";
import { NotificationComponent } from "../dashboard/widgets/notification/notification.component";
import { ZonalComponent } from "./widgets/zonal/zonal.component";
import { CorridorComponent } from "./widgets/corridor/corridor.component";
import { FailuresComponent } from "./widgets/failures/failures.component";
import { CycleComponent } from "./widgets/cycle/cycle.component";
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
interface Junction{
  value: string;
  viewValue: string;
}
@Component({
    selector: 'app-atcs',
    imports: [MapviewComponent, NotificationComponent, ZonalComponent, CorridorComponent, FailuresComponent, CycleComponent, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, CommonModule],
    templateUrl: './atcs.component.html',
    styleUrl: './atcs.component.css'
})
export class AtcsComponent {
  junctions: Junction[] = [
    {value: 'Junction 1', viewValue: 'Junction 1'},
    {value: 'Junction 2', viewValue: 'Junction 2'},
    {value: 'Junction 3', viewValue: 'Junction 3'},
  ];
   
  isCardExpanded = false;
  expand(): void {
    this.isCardExpanded = !this.isCardExpanded;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
     document.body.classList.toggle('fullscreenDiv');
  }
}
