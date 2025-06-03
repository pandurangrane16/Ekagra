import { text } from 'node:stream/consumers';
import { OnInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pollutants',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './pollutants.component.html',
  styleUrl: './pollutants.component.css'
})
export class PollutantsComponent implements OnInit {
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef) {}
  public element: any;
 

Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: { type: 'spline', height: 200, },
    
    title: { text: '', },
    xAxis: {  labels: {
      align: 'right' // Align labels to the right, placing them on the bottom axis
  }},
  yAxis:{
    title:{
      text:''
    },
  },
   credits: {
    enabled: false
  },
  legend:{
    enabled:false
  },
  series: [
    {
      name: 'PM2.5',
      type: 'line',
      data: [30, 40, 25, 50, 60, 35],
    },
    {
      name: 'PM10',
      type: 'line',
      data: [45, 55, 35, 65, 75, 45],
    },
    {
       name: 'CO',
       type: 'line',
       data: [60, 70, 50, 80, 90, 60],
    }
  ] as Highcharts.SeriesOptionsType[] // Casting to SeriesOptionsType[]
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
