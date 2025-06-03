import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-metro-cities',
  standalone: true,
  imports: [
    HighchartsChartModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './metro-cities.component.html',
  styleUrl: './metro-cities.component.css',
})
export class MetroCitiesComponent implements OnInit {
   Highcharts!: typeof Highcharts;
   chartOptions!: Highcharts.Options;
    isBrowser = false;
  gaugeValue=250;
  tempValue=26;
  humValue=23;
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
           height: 180,
           backgroundColor: 'transparent',
           spacingTop:0,
           spacingLeft:0
         },
        accessibility: { enabled: false },
        title: {
          text: 'New Delhi',
          align:'left',
          style:{
            fontSize:'14px',
            color:'black'
          }
      },
        credits:{
          enabled:false
        },
    pane: {
      // center: ['50%', '100%'],
      // size: '120%',
      // startAngle: -90,
      // endAngle: 90,
      // background: [
      //   {
      //     outerRadius: '100%',
      //     innerRadius: '90%',
      //     backgroundColor: '#f0f0f0',
      //     borderWidth: 0,
      //   },
      // ],
      startAngle:-180,
      endAngle: 100,
      background:[ {
        backgroundColor: 'transparent',
        innerRadius: '90%',
        outerRadius: '90%',
        shape: 'arc',
        borderWidth: 0, // set the width of the border
       
      }],
      center: ['50%', '75%'],
      size: '150%'
    },
        //   yAxis: {
        //    min: 0,
        //    max: 500,
        //    lineWidth: 0,
        //    tickPositions: [],
        //    stops: [[0.6, '#FFA726']],
        //  },
        yAxis: {
          min: 0,
          max: 250,
          tickPixelInterval: 0.1,
          tickPosition: 'inside',
          tickColor: ' #FB3B52',
          tickLength:15,
          tickWidth: 2,
        minorTickInterval: 1,
          labels: {
            enabled:true,
              distance: 20,
             //seHTML:true,
              style: {
                  fontSize: '14px'
              },
              formatter: function () {
                // You can format the label with HTML tags here
                // Example: show the tick value with an HTML span element
                return '<span style="color: #00ff00; width:1px; height:1px;">&nbsp;</span>';
              },
          },
          lineWidth: 0,
          // plotBands: [{
          //     from: 0,
          //     to: 130,
          //     color: '#55BF3B', // green
          //     thickness: 20,
          //     borderRadius: '50%'
          // }, {
          //     from: 150,
          //     to: 200,
          //     color: '#DF5353', // red
          //     thickness: 20,
          //     borderRadius: '50%'
          // }, {
          //     from: 120,
          //     to: 160,
          //     color: '#DDDF0D', // yellow
          //     thickness: 20
          // }]
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
        data: [0],
        radius: '100%',
        innerRadius: '90%',
      },
    ],
  };
    }

  //  async ngOnInit() {
  //    this.isBrowser = isPlatformBrowser(this.platformId);
   
  //    if (this.isBrowser) {
  //      const HighchartsMoreModule = await import('highcharts/highcharts-more');
  //      const SolidGaugeModule = await import('highcharts/modules/solid-gauge');
     
  //      this.Highcharts = Highcharts;
  //      this.chartOptions = {
  //        chart: {
  //          type: 'solidgauge',
  //          height: 200,
  //          backgroundColor: 'transparent',
  //          spacingTop:0
  //        },
  //        title: { text: '' },
  //        pane: {
  //          startAngle: -40,
  //          endAngle: 180,
  //          background: [{
  //            outerRadius: '100%',
  //            innerRadius: '80%',
  //            backgroundColor: '#f0f0f0',
  //            borderWidth: 0,
  //          }],
  //        },
  //        tooltip: { enabled: false },
  //        yAxis: {
  //          min: 0,
  //          max: 500,
  //          lineWidth: 0,
  //          tickPositions: [],
  //          stops: [[0.6, '#FFA726']],
  //        },
  //        plotOptions: {
  //          solidgauge: {
  //            dataLabels: { enabled: false },
  //            linecap: 'round',
  //            stickyTracking: false,
  //            rounded: true,
  //          }
  //        },
  //        series: [{
  //          name: 'Progress',
  //          type: 'solidgauge',
  //          data: [this.gaugeValue],
  //          radius: '100%',
  //          innerRadius: '80%',
  //          dataLabels: { enabled: false },
  //        }]
  //      };
  //    }
  //  }
 
}
}
