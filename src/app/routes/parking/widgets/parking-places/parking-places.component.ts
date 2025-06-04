import { OnInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface ChartSeries {
  name: string;
  data: number[];
  color: string;
}

@Component({
    selector: 'app-parking-places',
    imports: [HighchartsChartModule, MatButtonModule, CommonModule],
    templateUrl: './parking-places.component.html',
    styleUrl: './parking-places.component.css'
})
export class ParkingPlacesComponent implements OnInit {
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef) {}
  public element: any;

jsonData: ChartSeries[] = [
  { name: "Occupied", data: [30,40,35,45,30], color: '#5DBAE8' },
  { name: "Empty", data: [25,35,30,30,25], color: '#FFAD5C' }
];

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
          enabled: false,
          // format: '{point.percentage:.0f}%',
          formatter: function () {
        //    console.log(this);
            return `<div style="color: ${this.color};"> ${this.y} </div>`;
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
  series: this.jsonData.map(seriesItem => ({
    name: seriesItem.name,
    data: seriesItem.data,
    color: seriesItem.color,
    type: 'column'
  })) as Highcharts.SeriesOptionsType[],
  responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'top'
              }
          }
      }]
  }
  };

  ngOnInit(): void {
   
  } 

}