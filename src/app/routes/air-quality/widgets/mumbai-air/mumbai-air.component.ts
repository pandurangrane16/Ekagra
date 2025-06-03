import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mumbai-air',
  standalone: true,
  imports: [
    HighchartsChartModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './mumbai-air.component.html',
  styleUrl: './mumbai-air.component.css'
})
export class MumbaiAirComponent implements OnInit {
   Highcharts!: typeof Highcharts;
   chartOptions!: Highcharts.Options;
    isBrowser = false;
  tempValue=26;
  humValue=23;
guageImg:string = 'assets/img/Smiley-Sad.png';
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
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
           max: 500,
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
        data: [150],
        radius: '100%',
        innerRadius: '90%',
      },
    ],
  };
    }
  }
}