import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-severity',
  standalone: true,
  templateUrl: './severity.component.html',
  imports: [CommonModule, HighchartsChartModule, MatButtonModule, MatIconModule],
  styleUrls: ['./severity.component.css'],
})
export class SeverityComponent implements OnInit {
  Highcharts!: typeof Highcharts;
  chartOptions!: Highcharts.Options;
  isBrowser = false;
  gaugeValue=250;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  
    if (this.isBrowser) {
      const HighchartsMoreModule = await import('highcharts/highcharts-more');
      const SolidGaugeModule = await import('highcharts/modules/solid-gauge');
    
      this.Highcharts = Highcharts;
      this.chartOptions = {
        chart: {
          type: 'solidgauge',
          height: '100%',
          backgroundColor: 'transparent',
          spacingTop:0
        },
        title: { text: '' },
        pane: {
          startAngle: -40,
          endAngle: 180,
          background: [{
            outerRadius: '100%',
            innerRadius: '80%',
            backgroundColor: '#f0f0f0',
            borderWidth: 0,
          }],
        },
        tooltip: { enabled: false },
        yAxis: {
          min: 0,
          max: 500,
          lineWidth: 0,
          tickPositions: [],
          stops: [[0.6, '#FFA726']],
        },
        plotOptions: {
          solidgauge: {
            dataLabels: { enabled: false },
            linecap: 'round',
            stickyTracking: false,
            rounded: true,
          }
        },
        series: [{
          name: 'Progress',
          type: 'solidgauge',
          data: [this.gaugeValue],
          radius: '100%',
          innerRadius: '80%',
          dataLabels: { enabled: false },
        }]
      };
    }
  }
}
