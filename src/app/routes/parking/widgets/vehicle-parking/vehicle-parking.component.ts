import { OnInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-parking',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './vehicle-parking.component.html',
  styleUrl: './vehicle-parking.component.css'
})
export class VehicleParkingComponent implements OnInit {
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef) {}
  public element: any;
  jsonData = {
    "data": [
      { name: 'LMV', y: 320, color: '#5DBAE8', custom: { img: '/assets/img/LMV.png' } },
      { name: 'HMV', y: 50, color: '#FFB2B2', custom: { img: '/assets/img/HMV.png' } },
      { name: 'Private Bus', y: 100, color: '#FF9933', custom: { img: '/assets/img/bus.png' } },
      { name: 'Car', y: 100, color: '#192970', custom: { img: '/assets/img/car.png' } }
    ]
};
Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',  // Transparent background
      spacingLeft:0,
      spacingRight:0,
      spacingTop:0,
      spacingBottom:0
              
    },
    title: {
      text: '',
      align: 'left'
  },
  tooltip: {
    format: '{point.percentage:.0f} %',
  },
 
   legend: {
        enabled:false,
        layout: 'vertical',
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
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: [{
          enabled: true,
          // format: '{point.percentage:.0f}%',
          connectorShape: 'none',
          useHTML: true,
          distance:-10,
          formatter: function () {
            const point = (this as any).point;
            const img = point.custom?.img ?? '';
            return `
              <div style="text-align: center;">
                <img src="${img}" style="width: 32px; height: 32px; margin-bottom: 4px;" />
               
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
      showInLegend: true
  }
      
      
  },

  credits: {
    enabled: false
  },
  series: [{
    type: 'pie',
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

