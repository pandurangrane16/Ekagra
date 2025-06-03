import { OnInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-failures',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './failures.component.html',
  styleUrl: './failures.component.css'
})
export class FailuresComponent implements OnInit {
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef) {}
  public element: any;
  jsonData = {
    "data": [
        { "name": "Lamp", "y": 6, "color": "#344BFD"},
        { "name": "Detector", "y": 109, "color": "#66CC66"},
        { "name": "CDT", "y": 45, "color": "#53CEE7"},
        { "name": "Communication", "y": 320, "color": "#FFD200"},
        { "name": "RTC", "y": 50, "color": "#FC4F64"}
    ]
};
Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',  // Transparent background
        
    },
    title: {
      text: '',
      align: 'left'
  },
  yAxis: {
    title:{
      text:''
    },
  },
     legend: {
        enabled:false,
        layout: 'horizontal',
        verticalAlign: 'bottom',
        align: 'left',
        labelFormatter: function() {
         
                  return `<span style="color:${this.color}">${this.name}: </span><br/>`;
             
      },
        // symbolHeight: 25,
        // symbolRadius: 5,
        itemMarginTop: 10,
        itemMarginBottom: 10,
      },
   
  plotOptions: {
    column: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: [{
          enabled: true,
          useHTML: true,
          formatter: function () {
            return `
              <div style="text-align: center; background-color:${this.color}; border-radius:50%;width:32px; height:32px;line-height:32px; margin-bottom:5px;">
                
                <span style="font-size: 10px; color:#fff">
                  ${this.y}
                </span>
              </div>
            `;
          },
          style: {
            fontSize: '0.9em',
            background:'red',
            borderRadius:50,
            color:'black'
        
      }
    }],
    //  showInLegend: true
  }
      
      
  },

  credits: {
    enabled: false
  },
  series: [{
    innerSize: '50%',
    borderRadius: 0,
    data:this.jsonData.data,
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
