import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../Material.module';
import { AqiComponent } from '../../air-quality/widgets/aqi/aqi.component';
import { CommonModule, Location } from '@angular/common';
import { SensorService } from '../../../services/dashboard/senson.service';
import { LoaderService } from '../../../services/common/loader.service';
import { withLoader } from '../../../services/common/common';

@Component({
  selector: 'app-detailed',
  standalone: true,
  imports: [MaterialModule, AqiComponent, CommonModule],
  templateUrl: './detailed.component.html',
  styleUrl: './detailed.component.css'
})
export class DetailedComponent implements OnInit {
  sensorId!: number;
  projectId: number = 46;
  isLoading: boolean = false;
  locationMap: { [key: number]: string } = {};
  currentSiteData: any = null;
  startUnix: any;
  endUnix: any;

  private service = inject(SensorService);
  private loaderService = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  ngOnInit() {
    this.sensorId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Attempt to get name and aqi from navigation state for immediate display
    const state = window.history.state;
    if (state && state.name) {
      const aqi = state.aqi || 0;
      this.currentSiteData = {
        location: state.name,
        aqi: aqi,
        status: this.getAqiStatus(aqi),
        statusClass: this.getAqiClass(aqi),
        time: state.date ? new Date(state.date) : new Date(),
        pm10: '...',
        pm25: '...',
        parameters: []
      };

      this.startUnix = state.startDate;
      this.endUnix = state.endDate;
    }

   // this.fetchLocationMapping();
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
        if (this.sensorId) {
          this.loadSensorData(this.sensorId);
        }
      },
      error: (err) => console.error('Error fetching sites:', err)
    });
  }

  loadSensorData(id: number) {
    this.isLoading = true;

    // Use state-passed times if available, otherwise default to 24h
    let start = this.startUnix;
    let end = this.endUnix;

    if (!start || !end) {
      const now = new Date();
      end = Math.floor(now.getTime() / 1000) - 19800;
      start = end - 86400;
    }

    const sensorBody = {
      "data_type": "aggregate",
      "aggregation_period": 86400,
      "parameters": ["pm2.5", "pm10", "so2", "no2", "o3", "co", "co2", "temp", "humid", "rain", "light", "uvi", "noise", "aqi"],
      "parameter_attributes": ["value", "avg"],
      "things": [id],
      "from_time": start,
      "upto_time": end
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
            if (parsedResult.status === "success" && Array.isArray(parsedResult.data) && parsedResult.data.length > 0) {
              this.processSensorData(parsedResult.data[0]);
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

  processSensorData(sensor: any) {
    const params = sensor.parameter_values || {};
    const aqiValue = params.aqi?.value || 0;

    this.currentSiteData = {
      thing_id: sensor.thing_id,
      location: this.locationMap[sensor.thing_id] || `Device ${sensor.thing_id}`,
      time: new Date(sensor.time * 1000),
      aqi: aqiValue,
      status: this.getAqiStatus(aqiValue),
      statusClass: this.getAqiClass(aqiValue),
      pm10: params.pm10?.avg?.toFixed(2) || 'N/A',
      pm25: params['pm2.5']?.avg?.toFixed(2) || 'N/A',
      parameters: [
        { name: 'PM2.5', value: params['pm2.5']?.avg?.toFixed(2) || 'N/A', unit: 'µg/m³', color: this.getParamColor(params['pm2.5']?.avg, 'pm2.5') },
        { name: 'PM10', value: params.pm10?.avg?.toFixed(2) || 'N/A', unit: 'µg/m³', color: this.getParamColor(params.pm10?.avg, 'pm10') },
        { name: 'CO₂', value: params.co2?.avg?.toFixed(0) || 'N/A', unit: 'ppm', color: this.getParamColor(params.co2?.avg, 'co2') },
        { name: 'Temp', value: params.temp?.avg?.toFixed(1) || 'N/A', unit: '°C', color: this.getParamColor(params.temp?.avg, 'temp') },
        { name: 'Humidity', value: params.humid?.avg?.toFixed(1) || 'N/A', unit: '%', color: this.getParamColor(params.humid?.avg, 'humid') },
        { name: 'NO₂', value: params.no2?.avg?.toFixed(2) || 'N/A', unit: 'ppb', color: this.getParamColor(params.no2?.avg, 'no2') },
        { name: 'SO₂', value: params.so2?.avg?.toFixed(2) || 'N/A', unit: 'ppb', color: this.getParamColor(params.so2?.avg, 'so2') },
        { name: 'O₃', value: params.o3?.avg?.toFixed(2) || 'N/A', unit: 'ppb', color: this.getParamColor(params.o3?.avg, 'o3') }
      ]
    };
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

  getParamColor(value: number, param: string): string {
    if (!value && value !== 0) return 'greenB';
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

  goBack() {
    this.location.back();
  }
}
