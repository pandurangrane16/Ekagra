import { OnInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-historic',
    imports: [HighchartsChartModule, CommonModule],
    templateUrl: './historic.component.html',
    styleUrl: './historic.component.css'
})
export class HistoricComponent implements OnInit {
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
      type: 'area',
      backgroundColor: 'transparent',  // Transparent background
      height:220,
      spacingBottom:0,
        
    },
    legend: {
      enabled: false
    },
    xAxis: {
      title: {
        text: 'Time',
        style:{
          color:'#FF9933'
        }
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
        text: '',
        style:{
          color:'#FF9933'
        }
    },
    tickPositions: [0, 20, 40],
    },
    title: {
      text: '',
      align: 'left'
  },
  subtitle:{
    text:'',
    style:{
      fontSize: '16px',
              fontWeight: '500',
              color: '#1C2D7B'
    }
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
                [0, 'rgba(255, 147, 89,1)'],
                [0.7, 'rgba(255, 147, 89, 0.6)']
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
