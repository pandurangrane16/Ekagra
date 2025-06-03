import { OnInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cycle',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './cycle.component.html',
  styleUrl: './cycle.component.css'
})
export class CycleComponent implements OnInit {
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef) {}
  public element: any;
  jsonData = {
    "data": [
        { "name": "Faulty Junction", "y": 10,},
        { "name": "Faulty Detector", "y": 31,},
        { "name": "Functional Junction", "y": 40,},
        { "name": "Disconnected Junction", "y": 40,}
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
        text: 'Cycle Sequence Number'
    },
      type: 'datetime',
      labels: {
        formatter: function() {
          return Highcharts.dateFormat('%l %p', this.value as number);
        }
      }
    },
    yAxis:{
      title: {
        text: 'Distance(meter)'
    }
    },
    title: {
      text: '',
      align: 'left'
  },
  subtitle:{
    text:'Cycle Time',
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
                [0, 'rgba(173, 183, 249,1)'],
                [0.7, 'rgba(173, 183, 249, 0.6)']
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

