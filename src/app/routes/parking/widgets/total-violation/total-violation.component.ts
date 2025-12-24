import { Component, Inject, PLATFORM_ID, OnInit, inject } from '@angular/core';
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
    selector: 'app-total-violation',
    imports: [HighchartsChartModule,
        CommonModule,
        MatIconModule,
        MatButtonModule,],
    templateUrl: './total-violation.component.html',
    styleUrl: './total-violation.component.css'
})
export class TotalViolationComponent implements OnInit {
   Highcharts!: typeof Highcharts;
   totalEntries:any;
  totalUniqueSites:any;
   loaderService = inject(LoaderService);
   chartOptions!: Highcharts.Options;
    isBrowser = false;
    guageValue=250;
    jsonData = {
      "data": [
        { name: 'LMV', y: this.guageValue, color: '#5DBAE8', custom: { img: '/assets/img/gaugeDot.png' } },
      ]
    }
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private service:vmsdashboardService,private session: SessionService ) {}
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
          height: 250,
       //   width:150,
           backgroundColor: 'transparent',
           spacingTop:0,
           spacingLeft:0,
           spacingRight:0,
           spacingBottom:0,
          //  events: {
          //   render: function () {
          //     renderIcons.call(this); // <- make sure "this" refers to the chart
          //  //   addImageAtArcEnd.call(this);
          //   }
          //}
         },
        accessibility: { enabled: false },
        title: { text: '' },
        credits:{
          enabled:false
        },
    pane: {
       center: ['50%', '75%'],
       size: '80%',
      startAngle: -140,
        endAngle: 140,
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
           max: 250,
           lineWidth: 0,
           tickPositions: [],
           labels: {
    enabled: false
  },
         stops: [
    [0.1, '#1C2D7B'], // Dark blue from the start
    [1.0, '#1C2D7B']  // Dark blue at the end
  ],
         },
         tooltip:{
          enabled:false
         },
    plotOptions: {
      solidgauge: {
        dataLabels: { enabled: false, y: 5, borderWidth: 0, useHTML: true,
          // formatter: function () {
          //   //    console.log(this);
          //       return `<div style="color: ${this.color};"> ${this.y} </div>`;
          //     },
          // formatter: function () {
          //   const point = (this as any).point;
          //   const img = point.custom?.img ?? '';
          //   return `
          //     <div style="text-align: center;">
          //       <img src="${img}" style="width: 32px; height: 32px; margin-bottom: 4px; top:-118px; left:10px;position:absolute" />
               
          //     </div>
          //   `;
          // },
         },
     
        stickyTracking: true,
       
        linecap: 'square', // Change 'round' to 'square'
    rounded: false,
      },
    },
    series: [
      {
        type: 'solidgauge',
        data: this.jsonData.data,
        radius: '100%',
        innerRadius: '80%',
      },
    ],
  };
    }
    this.hello();
  }

  hello(){
    debugger;
    this.service
  .GetPenaltyDetails(
    'CMS Office Bhandup',
    '2024-12-11',
    '2025-12-19'
  )
  .pipe(withLoader(this.loaderService))
  .subscribe({
    next: (response: any) => {
      const result = response?.result;

      // ✅ Safely extract totals
      const totalEntries = result?.totalEntries ?? 0;
      const totalUniqueSites = result?.totalUniqueSites ?? 0;

      // 🔁 Use them wherever needed
      this.totalEntries = totalEntries;
      this.totalUniqueSites = totalUniqueSites;

      // // Example: bind totalEntries to gauge
      // this.guageValue = totalEntries;

      // console.log('Total Entries:', totalEntries);
      // console.log('Total Unique Sites:', totalUniqueSites);
    },
    error: (err) => {
      console.error('API Error:', err);
      this.totalEntries = 0;
      this.totalUniqueSites = 0;
      this.guageValue = 0;
    }
  });

  }
}

// interface CustomSeries extends Highcharts.Series {
//   icon?: Highcharts.SVGElement;
//   group: Highcharts.SVGElement; 
// }
// interface CustomPoint extends Highcharts.Point {
//   customImage?: Highcharts.SVGElement;
// }
// function renderIcons(this: Highcharts.Chart): void {
//   this.series.forEach(s => {
//     const series = s as CustomSeries;

//     const point = series.points?.[0];
//     if (!point?.shapeArgs) return;

//     if (!series.icon) {
//       series.icon = this.renderer
//        // .text(`<<i class="fa fa-${series.options.custom?.['icon']}"></i>>`, 0, 0, true)
//         .image('assets/img/gaugeDot.png', 0, 10)
//         .attr({ zIndex: 10, class:'test' })
//         .css({
//           color: series.options.custom?.['iconColor'] || '#000',
//           fontSize: '1.5em',
//           left:0
//         })
//         .add(series.group);
//     }

//     const { innerR, r } = point.shapeArgs;
//     series.icon.attr({
//       x: this.chartWidth / 2 - 15,
//       y: this.plotHeight / 2 - innerR - (r - innerR) / 2 + 8
//       // x:150,122.5
//       // y:85,43
//     });
//   });
// }

// function addImageAtArcEnd(this: Highcharts.Chart): void {
//   const lastSeries = this.series[this.series.length - 1];
//  // const point = lastSeries.points?.[0];

//   const rawPoint = lastSeries.points?.[0];
// if (!rawPoint || !rawPoint.shapeArgs) return;

// const point = rawPoint as CustomPoint;
//   if (!point || !point.shapeArgs) return;

//   const { start, end, r } = point.shapeArgs;

//   // Convert the end angle to radians and calculate its position
//   const angleRad = end * (Math.PI / 180);
//   const centerX = this.plotLeft + (this.plotWidth / 2);
//   const centerY = this.plotTop + (this.plotHeight / 2);

//   const x = centerX + r * Math.cos(angleRad) - 12; // -12 for centering
//   const y = centerY + r * Math.sin(angleRad) - 12;


 
//   // Store a reference so we don’t create duplicates
//   if (!point['customImage']) {
//     point['customImage'] = this.renderer
//       .image('assets/img/gaugeDot.png', x, y, 30, 30)
//       .attr({ zIndex: 10 })
//       .add();
//   } else {
//     point['customImage'].attr({ x, y }); // reposition on rerender
//   }
// }
