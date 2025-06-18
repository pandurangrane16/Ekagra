import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts';
//import { HighchartsChartModule } from 'highcharts-angular';
import highcharts3d from 'highcharts/highcharts-3d';

@Component({
  selector: 'app-chart3d',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chart3d.component.html',
  styleUrl: './chart3d.component.css'
})
export class Chart3dComponent {

 isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

chartOptions: Highcharts.Options = {
  chart: {
    type: 'column',
    options3d: {
      enabled: true,
      alpha: 20,
      beta: 30,
      depth: 200,
      viewDistance: 50
    }
  },
  title: {
    text: '3D Column Chart'
  },
  xAxis: {
    categories: ['Category 1', 'Category 2', 'Category 3']
  },
  series: [
    {
      type: 'column',
       color: '#FF0000',
      data: [1, 2, 3, 4]
    } as Highcharts.SeriesColumnOptions // 👈 Add this if needed to help TypeScript narrow it
  ]
};


 ngAfterViewInit() {
  // if (isPlatformBrowser(this.platformId)) {
  //   import('highcharts/highcharts-3d').then((module) => {
  //     console.log('highcharts-3d module:', module);
  //     // Try both ways:
  //     const highcharts3d = module.default ?? module;
  //     if (typeof highcharts3d === 'function') {
  //       highcharts3d(Highcharts);
  //       Highcharts.chart('chart-container', this.chartOptions);
  //     } else if (typeof module.highcharts3d === 'function') {
  //       module.highcharts3d(Highcharts);
  //       Highcharts.chart('chart-container', this.chartOptions);
  //     } else {
  //       console.error('Cannot find callable highcharts3d function in module:', module);
  //     }
  //   });
  // }
}

}
