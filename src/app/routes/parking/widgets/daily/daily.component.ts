import { OnInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.css'
})
export class DailyComponent implements OnInit {
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef) {}
  public element: any;
  jsonData = {
    "data": [
        { "name": "Mon", "y": 0,},
        { "name": "Tue", "y": 31,},
        { "name": "Wed", "y": 10,},
        { "name": "Thu", "y": 20,},
        { "name": "Fri", "y": 10,},
        { "name": "Sat", "y": 30,},
        { "name": "Sun", "y": 40,},
    ]
};

Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',  // Transparent background
        
    },
    legend: {
      enabled: false
    },
    xAxis: {
      title: {
        text: 'Daily Average'
    },
      type: 'datetime',
      labels: {
        enabled: false // Hides the x-axis labels
      },
      tickLength: 0, // Hides the ticks
      lineWidth: 0,  // Optional: hides the axis line itself
    },
    yAxis:{
      title: {
        text: ''
    },
    labels: {
      enabled: false
    },

    gridLineWidth: 0,
    tickLength: 0
    },
    title: {
      text: '',
      align: 'left'
  },
  subtitle:{
    text:'',
  },
  
  plotOptions: {
    area: {
      marker: {
        enabled: false,
        symbol: 'circle',
        radius: 2,
        states: {
            hover: {
                enabled: true
            }
        }
    },
        lineWidth: 1,
        color: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0.2, '#49A677'],
                [1, 'rgba(255, 255, 255, 0)']
            ]
        },
        states: {
            hover: {
                lineWidth: 1
            }
        },
        threshold: null
    }
},
  credits: {
    enabled: false
  },
  series: [{
    type: 'area',
    data:this.jsonData.data,
    pointStart: new Date().setHours(6, 0, 0, 0), // today at midnight
    pointInterval: 2 * 3600 * 1000 // 2 hours in milliseconds
}] as Highcharts.SeriesOptionsType[] // Casting to SeriesOptionsType[]
 ,
  responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
            
              legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
              }
          }
      }]
  }
  };

  ngOnInit(): void {
   
  
  } 

}
