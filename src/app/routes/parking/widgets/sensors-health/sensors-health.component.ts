import { Component, inject,Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { withLoader } from '../../../../services/common/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { SessionService } from '../../../../services/common/session.service';
import { vmsdashboardService } from '../../../../services/dashboard/vmsDashboard.service';

@Component({
    selector: 'app-sensors-health',
    imports: [HighchartsChartModule,
        CommonModule,
        MatIconModule,
        MatButtonModule,],
    templateUrl: './sensors-health.component.html',
    styleUrl: './sensors-health.component.css'
})
export class SensorsHealthComponent implements OnInit {
   Highcharts!: typeof Highcharts;
     loaderService = inject(LoaderService);
   chartOptions!: Highcharts.Options;
    isBrowser = false;
  tempValue=26;
  humValue=23;
  apiData = {
    "result": { "up": 5, "down": 0, "unknown": 0, "totalSensors": 5 }
  };
guageImg:string = 'assets/img/smile.png';
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private service:vmsdashboardService,private session: SessionService) {}
  async ngOnInit(): Promise<void> {

    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // Dynamically import modules in the browser only
      const HighchartsMore = await import('highcharts/highcharts-more') as any;
 const SolidGauge = await import('highcharts/modules/solid-gauge') as any;

      this.Highcharts = Highcharts;

      this.chartOptions = {
        chart: {
           type: 'solidgauge',
          height: 150,
       //   width:150,
           backgroundColor: 'transparent',
           spacingTop:-100,
           spacingLeft:0,
           spacingRight:0,
           spacingBottom:0
         },
        accessibility: { enabled: false },
        title: { text: '' },
        credits:{
          enabled:false
        },
    pane: {
      center: ['50%', '100%'],
      size: '100%',
      startAngle: -90,
      endAngle: 90,
      background: [
        {
          outerRadius: '100%',
          innerRadius: '90%',
          backgroundColor: '#f0f0f0',
          borderWidth: 0,
        },
      ],
    },
          yAxis: {
           min: 0,
           max: 9,
           lineWidth: 0,
           tickPositions: [],
           stops: [[0.6, '#FFA726']],
         },
    plotOptions: {
      solidgauge: {
        dataLabels: { enabled: false, y: 5, borderWidth: 0, useHTML: true },
        linecap: 'round',
        stickyTracking: false,
        rounded: true,
      },
    },
    series: [
      {
        type: 'solidgauge',
        data: [6],
        radius: '100%',
        innerRadius: '90%',
      },
    ],
  };

      this.GetSensorStatusSummary();
    }
  }

GetSensorStatusSummary() {
  this.service
    .GetSensorStatusSummary(
      '2024-12-11',
      '2025-12-19'
    )
    .pipe(withLoader(this.loaderService))
    .subscribe({
   next: (response: any) => {
  if (response && response.success) {
    const data = response.result;
    
    // Update the visual gauge and labels
    this.chartOptions = {
      ...this.chartOptions,
      tooltip: {
    enabled: true,
    useHTML: true,
    backgroundColor: '#ffffff',
    style: {
      fontSize: '12px'
    },
    formatter: function () {
      // 'this.point' refers to the data object you created in GetSensorStatusSummary
      const point = this as any;
      return `
        <div style="padding: 5px;">
          <b style="color: #1C2D7B; display: block; margin-bottom: 5px;">Sensor Health</b>
          <span style="color: #28a745;">● Up: <b>${point.up}</b></span><br/>
          <span style="color: #dc3545;">● Down: <b>${point.down}</b></span><br/>
          <span style="color: #6c757d;">● Total: <b>${point.total}</b></span>
        </div>
      `;
    }
  },
      yAxis: {
        ...this.chartOptions.yAxis,
        max: data.totalSensors // The total capacity
      },
    series: [{
    type: 'solidgauge',
    name: 'Sensors Up',
    data: [{
      y: data.up,
      // Cast as any to bypass the 'known properties' check
      up: data.up,
      down: data.down,
      total: data.totalSensors
    } as any], 
    radius: '100%',
    innerRadius: '90%'
  }]
    };

    // Optional: update the smile/warning image based on health
    this.guageImg = data.up === data.totalSensors ? 'assets/img/smile.png' : 'assets/img/warning.png';
  }
},
      error: (err) => {
        console.error('Error fetching sensor summary', err);
      }
    });
}
}
