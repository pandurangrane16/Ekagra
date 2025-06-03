import { Component, Inject, PLATFORM_ID, OnInit, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Accessibility from 'highcharts/modules/accessibility';
Accessibility(Highcharts);

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
  chartSpeed!: Highcharts.Chart;
  Highcharts!: typeof Highcharts;
  chartOptions!: Highcharts.Options;
  isBrowser = false;
  gaugeValue=250;
  tempValue=26;
  humValue=23;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  
    if (this.isBrowser) {
      const HighchartsMoreModule = await import('highcharts/highcharts-more');
      const SolidGaugeModule = await import('highcharts/modules/solid-gauge');
    
      this.Highcharts = Highcharts;
      this.chartOptions = {
        chart: {
          type: 'gauge',
          plotBackgroundColor:'white',
          plotBackgroundImage: ' ',
          plotBorderWidth:0,
          plotShadow: false,
          height: 250
      },
  
      title: {
          text: 'New Delhi',
          align:'left',
          style:{
            fontSize:'14px',
            color:'black'
          }
      },
  
      pane: {
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
  
      // the value axis
      yAxis: {
          min: 0,
          max: 250,
          tickPixelInterval: 1,
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
      credits: {
        enabled: false
      },
      accessibility: {
        enabled: true // Disable the accessibility module
      },
      series: [{
        type: 'solidgauge',
          name: 'Speed',
          data: [0],
          tooltip: {
              valueSuffix: ' km/h'
          },
          dataLabels: {
            enabled:false,
              format: '{y} km/h',
              borderWidth:  0,
              color:  '#333333',
              style: {
                  fontSize: '16px'
              }
          }
  
      }]
  
  };
   

  //Add some life
  setInterval(() => {
    if (this.chartSpeed && this.chartSpeed.series[0] && this.chartSpeed.series[0].points[0]) {

       console.log('chartSpeed:', this.chartSpeed); // Log the chartSpeed object
      const point = this.chartSpeed.series[0].points[0];
  
      if (point) {
        const y = point.y ?? 0; // default to 0 if undefined
        const inc = Math.round((Math.random() - 0.5) * 100);
        let newVal = y + inc;
  
        if (newVal < 0 || newVal > 200) {
          newVal = y - inc;
        }
  
        point.update(newVal);
      }
    }
  }, 100);
    }

}
 
}
