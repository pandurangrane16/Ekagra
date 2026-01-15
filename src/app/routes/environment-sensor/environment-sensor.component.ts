import { Component } from '@angular/core';
import { NotificationComponent } from '../dashboard/widgets/notification/notification.component';
import { ZonalComponent } from '../atcs/widgets/zonal/zonal.component';
import { CorridorComponent } from '../atcs/widgets/corridor/corridor.component';
import { FailuresComponent } from '../atcs/widgets/failures/failures.component';
import { CycleComponent } from '../atcs/widgets/cycle/cycle.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CmBreadcrumbComponent } from '../../common/cm-breadcrumb/cm-breadcrumb.component';

@Component({
  selector: 'app-environment-sensor',
  imports: [NotificationComponent, ZonalComponent, CorridorComponent, FailuresComponent, CycleComponent, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, CommonModule, MatDatepickerModule, CmBreadcrumbComponent],
  templateUrl: './environment-sensor.component.html',
  styleUrl: './environment-sensor.component.css'
})
export class EnvironmentSensorComponent {
endDate: Date = new Date();
  startDate: Date = new Date(this.endDate.getTime() - (24 * 60 * 60 * 1000));
projectId: number = 0;
//items = Array(4);
items = [
  { location: 'Bhandup', aqi: 283, status: 'Poor' },
  { location: 'Andheri', aqi: 190, status: 'Moderate' },
  { location: 'Borivali', aqi: 120, status: 'Good' },
  { location: 'Dadar', aqi: 310, status: 'Very Poor' }
];

 ZoneSelectSettings = {
          labelHeader: 'Select Zone',
          lableClass: 'form-label',
           multiple: false,
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        };
        isZoneOptionsLoaded: boolean = false;
        ZoneOptions: any[] = [];
        selectedZones: any[] = [];
  siteList: any[] = [];


        onActionSelectionChange(event: any) {
  // this.siteList = [];
  const selectedValues = event.value || [];
  const allOption = this.ZoneOptions.find((x: any) => x.text.toLowerCase() === 'all');

  if (!allOption) return;

  const isAllSelected = selectedValues.some((x: any) => x.id === allOption.id);

  if (isAllSelected) {
    const allExceptAll = this.ZoneOptions.filter((x: any) => x.id !== allOption.id);
    this.selectedZones = [...allExceptAll];
  } else {
    this.selectedZones = selectedValues.filter((x: any) => x.id !== allOption.id);
  }
debugger;
  // 2. UPDATE THE IDS HERE (Not in the template)
 // this.selectedZoneIds = this.selectedZones.map(zone => zone.id);
  const allPolygons: any[] = [];
  
  this.selectedZones.forEach(zone => {
    if (zone.zoneCordinate) {
      try {
        // Parse the string (e.g. "[[[lng,lat],...]]")
        const parsed = JSON.parse(zone.zoneCordinate);
        // Push the actual polygon array into our master list
        allPolygons.push(parsed[0]); 
      } catch (e) {
        console.error("Invalid coordinates for zone: " + zone.text, e);
      }
    }
  });

  // 2. Convert the master list back to a string format your map method expects
  // This will look like: [ [[p1],[p2]], [[p1],[p2]] ]
//   this.zoneCordinate2 = JSON.stringify(allPolygons);
//   console.log("zoneCordinate2", this.zoneCordinate2);

//   this.loadJunctions();
//   this.loadCorridorData();
//   this.loadpoints();
 }

// Ensure you also update IDs in your clear function
clearActions() {
  this.selectedZones = [];
  // this.selectedZoneIds = [];
  // this.loadJunctions();
  // this.loadCorridorData();
}
handleDateChange(evt: any, type: string) {
  debugger;
  if (type === "start") {
    this.startDate = evt.value;
  } else {
    this.endDate = evt.value;
  }

  //this.loadCorridorData();
 
}

}
