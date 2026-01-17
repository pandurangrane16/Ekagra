import { Component, ViewChild, inject, OnInit, AfterViewInit } from '@angular/core';
import { MaterialModule } from '../../../Material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LoaderService } from '../../../services/common/loader.service';
import { withLoader } from '../../../services/common/common';
import { SensorService } from '../../../services/dashboard/senson.service';
import { SessionService } from '../../../services/common/session.service';
import { ToastrService } from 'ngx-toastr';

import { CmBreadcrumbComponent } from '../../../common/cm-breadcrumb/cm-breadcrumb.component';

export interface SensorElement {
  thing_id: number;
  location: string;
  time: Date;
  aqi: number;
  status: string;
  statusClass: string;
  temperature: string;
  humidity: string;
  pm25: string;
  pm10: string;
  no2: string;
  so2: string;
  o3: string;
  co: string;
}

@Component({
  selector: 'app-sensorlist',
  standalone: true,
  imports: [
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatTooltipModule,
    CmBreadcrumbComponent
  ],
  templateUrl: './sensorlist.component.html',
  styleUrl: './sensorlist.component.css'
})
export class SensorlistComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'AQI', 'Temperature', 'Humidity', 'PM25', 'PM10', 'NO2', 'SO2', 'O3', 'CO'];
  dataSource = new MatTableDataSource<SensorElement>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Services
  private service = inject(SensorService);
  private loaderService = inject(LoaderService);
  private sessionService = inject(SessionService);
  private toaster = inject(ToastrService);
  private router = inject(Router);

  // Filter State
  endDate: Date = new Date();
  startDate: Date = new Date(this.endDate.getTime() - (24 * 60 * 60 * 1000));
  startUnix: any;
  endUnix: any;
  
  projectId: number = 46; 
  isLoading: boolean = false;
  locationMap: { [key: number]: string } = {};
  
  ZoneOptions: any[] = [];
  selectedZones: any[] = [];
  selectedZoneIds: any[] = [];
  currentThingIds: number[] = [];
  isZoneOptionsLoaded: boolean = false;
  noDataFound2: boolean = false;

  ZoneSelectSettings = {
    labelHeader: 'Select Zone',
    lableClass: 'form-label',
    multiple: true,
    formFieldClass: '',
    appearance: 'fill',
    options: [] as any[]
  };

  constructor() {}

  ngOnInit() {
    this.initializeDefaultDates();
    this.getZoneList();
    this.fetchLocationMapping();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  initializeDefaultDates() {
    const state = window.history.state;

    // Check if we have dates from history state (Back navigation)
    if (state && state.startDate && state.endDate) {
      this.startDate = new Date(state.startDate);
      this.endDate = new Date(state.endDate);
      this.startUnix = state.startUnix;
      this.endUnix = state.endUnix;
      console.log('Restored range from history state:', this.startUnix, 'to', this.endUnix);
      return;
    }

    const now = new Date();
    this.endDate = now;
    this.startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    const endUnixRaw = Math.floor(this.endDate.getTime() / 1000);
    const startUnixRaw = Math.floor(this.startDate.getTime() / 1000);

    // Apply 5:30 offset
    this.endUnix = endUnixRaw - 19800;
    this.startUnix = startUnixRaw - 19800;
    console.log('Initialized default 24h range:', this.startUnix, 'to', this.endUnix);
  }

  refreshData() {
    this.loadSensorData();
  }

  clearActions() {
    this.selectedZones = [];
    this.selectedZoneIds = [];
    this.loadJunctions();
  }

  fetchLocationMapping() {
    this.service.GetSiteMasterByProjectId(this.projectId).subscribe({
      next: (response: any) => {
        const sites = response?.result || [];
        const newMap: { [key: number]: string } = {};
        sites.forEach((site: any) => {
          if (site.siteId) {
            const id = Number(site.siteId);
            newMap[id] = site.siteName;
          }
        });
        this.locationMap = newMap;
      },
      error: (err) => console.error('Error fetching sites:', err)
    });
  }

  getZoneList() {
    this.service.GetAllZones().pipe(withLoader(this.loaderService)).subscribe({
      next: (response: any) => {
        const items = response?.result || [];
        const projectOptions = items.map((item: any) => ({
          text: (item.zoneName || '').trim() || 'Unknown',
          id: item.id
        }));

        this.selectedZones = [...projectOptions];
        this.selectedZoneIds = this.selectedZones.map(zone => zone.id);

        projectOptions.unshift({
          text: 'All',
          id: 0
        });
        this.ZoneOptions = projectOptions;
        this.ZoneSelectSettings.options = projectOptions;
        this.isZoneOptionsLoaded = true;

        this.loadJunctions();


        this.loadJunctions();
      },
      error: (err) => console.error('Error fetching Zone list', err)
    });
  }

  onActionSelectionChange(event: any) {
    const selectedValues = event.value || [];
    const allOption = this.ZoneOptions.find((x: any) => x.text.toLowerCase() === 'all');

    if (allOption) {
      const isAllSelected = selectedValues.some((x: any) => x.id === allOption.id);
      if (isAllSelected) {
        const allExceptAll = this.ZoneOptions.filter((x: any) => x.id !== allOption.id);
        this.selectedZones = [...allExceptAll];
      } else {
        this.selectedZones = selectedValues.filter((x: any) => x.id !== allOption.id);
      }
    } else {
      this.selectedZones = selectedValues;
    }

    this.selectedZoneIds = this.selectedZones.map(zone => zone.id);

    // Update history state
    const currentState = window.history.state || {};
    window.history.replaceState({
      ...currentState,
    }, '');

    this.loadJunctions();
  }

  loadJunctions() {
    this.service.GetActiveSitesbyZoneAndProject(this.selectedZoneIds, [this.projectId])
      .pipe(withLoader(this.loaderService))
      .subscribe((res: any) => {
        if (res?.success && Array.isArray(res.result)) {
          this.currentThingIds = res.result
            .map((item: any) => Number(item.siteId))
            .filter((id: number) => !isNaN(id));
          
          this.loadSensorData();
        } else {
          this.currentThingIds = [];
          this.dataSource.data = [];
        }
      });
  }

  loadSensorData() {
    if (!this.currentThingIds || this.currentThingIds.length === 0) {
      this.dataSource.data = [];
      return;
    }

    this.isLoading = true;

    const sensorBody = {
      "data_type": "aggregate",
      "aggregation_period": 86400,
      "parameters": ["pm2.5", "pm10", "so2", "no2", "o3", "co", "co2", "temp", "humid", "rain", "light", "uvi", "noise", "aqi"],
      "parameter_attributes": ["value", "avg"],
      "things": this.currentThingIds,
      "from_time": this.startUnix,
      "upto_time": this.endUnix
    };

    const payload = {
      "ProjectId": this.projectId,
      "Type": "0",
      "APIName": "Things",
      "BaseURL": "https://app.aurassure.com/-/api/iot-platform/v1.1.0/clients/17143/applications/16/things/data",
      "RequestURL": "https://app.aurassure.com/-/api/iot-platform/v1.1.0/clients/17143/applications/16/things/data",
      "HttpMethod": "post",
      "RequestParam": "",
      "header": "Access-Id:yD8rel2aRanyM97d;Access-Key:86vZ2xQiFVwnDjGnyh51T5FQqxFiOIf01gObyTssdtXXAmoT9NxvgXhmLhq7qa0S",
      "AuthReq": false,
      "AuthenticatioType": "",
      "AuthenticationHeader": "",
      "CommType": 0,
      "BodyType": "JSON",
      "Body": JSON.stringify(sensorBody),
      "ResponseStatusCode": "",
      "Response": "",
      "ProjectName": "",
      "IsDeleted": false,
      "DeleterUserId": "",
      "DeletionTime": "2026-01-16T12:54:27.480Z",
      "LastModificationTime": "2026-01-16T12:54:27.480Z",
      "LastModifierUserId": "",
      "CreationTime": "2026-01-16T12:54:27.480Z",
      "CreatorUserId": ""
    };

    this.service.Consume(payload).pipe(withLoader(this.loaderService)).subscribe({
      next: (response: any) => {
        if (response?.success && response?.result) {
          try {
            const parsedResult = JSON.parse(response.result);
            if (parsedResult.status === "success" && Array.isArray(parsedResult.data)) {
              this.processSensorData(parsedResult.data);
            }
          } catch (error) {
            console.error("JSON Parsing Error:", error);
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("API Error:", err);
        this.isLoading = false;
      }
    });
  }

  processSensorData(data: any[]) {
    this.dataSource.data = data.map((sensor: any) => {
      const params = sensor.parameter_values || {};
      const aqiValue = params.aqi?.value || 0;

      return {
        thing_id: sensor.thing_id,
        location: this.locationMap[sensor.thing_id] || `Device ${sensor.thing_id}`,
        time: new Date(sensor.time * 1000),
        aqi: aqiValue,
        status: this.getAqiStatus(aqiValue),
        statusClass: this.getAqiClass(aqiValue),
        temperature: params.temp?.avg?.toFixed(1) || 'N/A',
        humidity: params.humid?.avg?.toFixed(1) || 'N/A',
        pm25: params['pm2.5']?.avg?.toFixed(2) || 'N/A',
        pm10: params.pm10?.avg?.toFixed(2) || 'N/A',
        no2: params.no2?.avg?.toFixed(2) || 'N/A',
        so2: params.so2?.avg?.toFixed(2) || 'N/A',
        o3: params.o3?.avg?.toFixed(2) || 'N/A',
        co: params.co?.avg?.toFixed(2) || 'N/A'
      };
    });
  }

  getAqiStatus(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 200) return 'Poor';
    if (aqi <= 300) return 'Unhealthy';
    if (aqi <= 400) return 'Severe';
    return 'Hazardous';
  }

  getAqiClass(aqi: number): string {
    if (aqi <= 50) return 'text-success';
    if (aqi <= 100) return 'text-warning';
    if (aqi <= 200) return 'text-orange';
    if (aqi <= 300) return 'text-danger';
    if (aqi <= 400) return 'text-purple';
    return 'text-danger';
  }

  handleDateChange(evt: any, type: string) {
    if (!evt.value) return;

    const selectedDate = new Date(evt.value);
    const unixSeconds = Math.floor(selectedDate.getTime() / 1000);
    const shiftedUnix = unixSeconds - 19800;

    if (type === 'start') {
      this.startUnix = shiftedUnix;
      this.startDate = selectedDate;
    } else {
      this.endUnix = shiftedUnix;
      this.endDate = selectedDate;
    }

    // Update history state so "Back" navigation restores these dates
    const currentState = window.history.state || {};
    window.history.replaceState({
      ...currentState,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      startUnix: this.startUnix,
      endUnix: this.endUnix
    }, '');

    if (this.startUnix && this.endUnix) {
      this.loadSensorData();
    }
  }

  goBack() {
    this.router.navigate(['/sensor']);
  }
}
