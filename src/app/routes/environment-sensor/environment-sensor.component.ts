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
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-environment-sensor',
  imports: [NotificationComponent, ZonalComponent, CorridorComponent, FailuresComponent, CycleComponent, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, CommonModule, MatDatepickerModule, CmBreadcrumbComponent,RouterModule],
  templateUrl: './environment-sensor.component.html',
  styleUrl: './environment-sensor.component.css'
})

export class EnvironmentSensorComponent {
endDate: Date = new Date();
  startDate: Date = new Date(this.endDate.getTime() - (24 * 60 * 60 * 1000));
projectId: number = 0;

// Mapping of thing_id to location names
locationMap: { [key: number]: string } = {
  24087: 'Bhandup',
  24088: 'Andheri',
  24089: 'Borivali',
  24090: 'Dadar',
  24091: 'Kurla',
  24092: 'Thane',
  24093: 'Mulund',
  24101: 'Goregaon'
};

// Hardcoded sensor data
sensorData = {
  "status": "success",
  "data": [
    {
      "thing_id": 24087,
      "time": 1753252200,
      "parameter_values": {
        "aqi": { "value": 105 },
        "co": { "avg": 0.02 },
        "co2": { "avg": 1694.19 },
        "humid": { "avg": 45.30 },
        "o3": { "avg": 9 },
        "light": { "avg": 271.95 },
        "no2": { "avg": 3.45 },
        "pm10": { "avg": 106.57 },
        "so2": { "avg": 3.06 },
        "pm2.5": { "avg": 50.75 },
        "temp": { "avg": 27.63 },
        "uvi": { "avg": 0 }
      }
    },
    {
      "thing_id": 24088,
      "time": 1753252200,
      "parameter_values": {
        "aqi": { "value": 54 },
        "co": { "avg": 0.01 },
        "co2": { "avg": 1217.46 },
        "humid": { "avg": 43.87 },
        "o3": { "avg": 9 },
        "light": { "avg": 379.91 },
        "no2": { "avg": 3.62 },
        "pm10": { "avg": 54.20 },
        "so2": { "avg": 3.48 },
        "pm2.5": { "avg": 25.81 },
        "temp": { "avg": 27.34 },
        "uvi": { "avg": 0 }
      }
    },
    {
      "thing_id": 24089,
      "time": 1753252200,
      "parameter_values": {
        "aqi": { "value": 59 },
        "co": { "avg": 0.04 },
        "co2": { "avg": 989.90 },
        "humid": { "avg": 45.72 },
        "o3": { "avg": 9 },
        "light": { "avg": 330.87 },
        "no2": { "avg": 3.62 },
        "pm10": { "avg": 58.97 },
        "so2": { "avg": 3.71 },
        "pm2.5": { "avg": 28.08 },
        "temp": { "avg": 26.12 },
        "uvi": { "avg": 0 }
      }
    },
    {
      "thing_id": 24090,
      "time": 1753252200,
      "parameter_values": {
        "aqi": { "value": 72 },
        "co": { "avg": 0.03 },
        "co2": { "avg": 931.92 },
        "humid": { "avg": 43.69 },
        "o3": { "avg": 9 },
        "light": { "avg": 341.73 },
        "no2": { "avg": 4.70 },
        "pm10": { "avg": 72.33 },
        "so2": { "avg": 7.14 },
        "pm2.5": { "avg": 34.44 },
        "temp": { "avg": 27.56 },
        "uvi": { "avg": 0 }
      }
    },
    {
      "thing_id": 24091,
      "time": 1753252200,
      "parameter_values": {
        "aqi": { "value": 105 },
        "co": { "avg": 0.11 },
        "co2": { "avg": 953.86 },
        "humid": { "avg": 44.05 },
        "o3": { "avg": 5 },
        "light": { "avg": 343.97 },
        "no2": { "avg": 3.62 },
        "pm10": { "avg": 106.67 },
        "so2": { "avg": 0.27 },
        "pm2.5": { "avg": 50.80 },
        "temp": { "avg": 27.66 },
        "uvi": { "avg": 0 }
      }
    },
    {
      "thing_id": 24092,
      "time": 1753252200,
      "parameter_values": {
        "aqi": { "value": 111 },
        "co": { "avg": 0.21 },
        "co2": { "avg": 942.99 },
        "humid": { "avg": 45.64 },
        "o3": { "avg": 8.96 },
        "light": { "avg": 335.48 },
        "no2": { "avg": 4.60 },
        "pm10": { "avg": 116.26 },
        "so2": { "avg": 5.21 },
        "pm2.5": { "avg": 55.36 },
        "temp": { "avg": 27.54 },
        "uvi": { "avg": 0 }
      }
    },
    {
      "thing_id": 24093,
      "time": 1753252200,
      "parameter_values": {
        "aqi": { "value": 99 },
        "co": { "avg": 0.02 },
        "co2": { "avg": 986.68 },
        "humid": { "avg": 46.49 },
        "o3": { "avg": 8 },
        "light": { "avg": 315.10 },
        "no2": { "avg": 3.32 },
        "pm10": { "avg": 98.82 },
        "so2": { "avg": 3.86 },
        "pm2.5": { "avg": 47.06 },
        "temp": { "avg": 27.38 },
        "uvi": { "avg": 0 }
      }
    },
    {
      "thing_id": 24101,
      "time": 1753252200,
      "parameter_values": {
        "aqi": { "value": 97 },
        "co": { "avg": 0.02 },
        "co2": { "avg": 822.35 },
        "humid": { "avg": 45.59 },
        "o3": { "avg": 9.68 },
        "light": { "avg": 296.99 },
        "no2": { "avg": 7.29 },
        "pm10": { "avg": 96.74 },
        "so2": { "avg": 3.67 },
        "pm2.5": { "avg": 46.07 },
        "temp": { "avg": 27.60 },
        "uvi": { "avg": 0 }
      }
    }
  ]
};

// Processed items for display
items: any[] = [];

ngOnInit() {
  this.processData();
}

refreshData() {
  this.processData();
}

processData() {
  this.items = this.sensorData.data.map((site: any) => {
    const aqi = site.parameter_values.aqi?.value || 0;
    return {
      thing_id: site.thing_id,
      location: this.locationMap[site.thing_id] || `Site ${site.thing_id}`,
      time: new Date(site.time * 1000),
      aqi: aqi,
      status: this.getAqiStatus(aqi),
      statusClass: this.getAqiClass(aqi),
      parameters: [
        { name: 'PM2.5', value: site.parameter_values['pm2.5']?.avg?.toFixed(2) || 'N/A', unit: 'µg/m³', color: this.getParamColor(site.parameter_values['pm2.5']?.avg, 'pm2.5') },
        { name: 'PM10', value: site.parameter_values.pm10?.avg?.toFixed(2) || 'N/A', unit: 'µg/m³', color: this.getParamColor(site.parameter_values.pm10?.avg, 'pm10') },
        { name: 'CO₂', value: site.parameter_values.co2?.avg?.toFixed(0) || 'N/A', unit: 'ppm', color: this.getParamColor(site.parameter_values.co2?.avg, 'co2') },
        { name: 'Temp', value: site.parameter_values.temp?.avg?.toFixed(1) || 'N/A', unit: '°C', color: this.getParamColor(site.parameter_values.temp?.avg, 'temp') },
        { name: 'Humidity', value: site.parameter_values.humid?.avg?.toFixed(1) || 'N/A', unit: '%', color: this.getParamColor(site.parameter_values.humid?.avg, 'humid') },
        { name: 'NO₂', value: site.parameter_values.no2?.avg?.toFixed(2) || 'N/A', unit: 'ppb', color: this.getParamColor(site.parameter_values.no2?.avg, 'no2') },
        { name: 'SO₂', value: site.parameter_values.so2?.avg?.toFixed(2) || 'N/A', unit: 'ppb', color: this.getParamColor(site.parameter_values.so2?.avg, 'so2') },
        { name: 'O₃', value: site.parameter_values.o3?.avg?.toFixed(2) || 'N/A', unit: 'ppb', color: this.getParamColor(site.parameter_values.o3?.avg, 'o3') }
      ]
    };
  });
}

getAqiStatus(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Poor';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Poor';
  return 'Hazardous';
}

getAqiClass(aqi: number): string {
  if (aqi <= 50) return 'text-success';
  if (aqi <= 100) return 'text-warning';
  if (aqi <= 150) return 'text-orange';
  if (aqi <= 200) return 'text-danger';
  return 'text-purple';
}

getParamColor(value: number, param: string): string {
  if (!value && value !== 0) return 'greenB';
  
  // Define thresholds for each parameter
  const thresholds: { [key: string]: { good: number; moderate: number; poor: number } } = {
    'pm2.5': { good: 30, moderate: 60, poor: 90 },
    'pm10': { good: 50, moderate: 100, poor: 150 },
    'co2': { good: 800, moderate: 1200, poor: 1500 },
    'temp': { good: 25, moderate: 30, poor: 35 },
    'humid': { good: 60, moderate: 70, poor: 80 },
    'no2': { good: 5, moderate: 10, poor: 20 },
    'so2': { good: 5, moderate: 10, poor: 20 },
    'o3': { good: 50, moderate: 100, poor: 150 }
  };

  const t = thresholds[param];
  if (!t) return 'greenB';
  
  if (value <= t.good) return 'greenB';
  if (value <= t.moderate) return 'lGreenB';
  if (value <= t.poor) return 'yellowB';
  return 'redB';
}

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


constructor(private router: Router) {}
openDetailedView() {
  this.router.navigate(['/sensor:id']);
}

}
