import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [HighchartsChartModule ],
  templateUrl: './incidents.component.html',
  styleUrl: './incidents.component.css'
})
export class IncidentsComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent'  // Transparent background
    },
    title: {
      text: '',
      align: 'left'
  },
  
  yAxis: {
      title: {
          text: ''
      },
      min: 0, max: 30,
  },

  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },

  legend: {
      enabled :false
  },

  plotOptions: {
      series: {
          label: {
              connectorAllowed: false
          },
          pointStart: 0
      }
  },


  series: [{
    type: 'line',
    name: 'Installation & Developers',
    data: [
        25, 20, 18, 21, 15, 14,17, 16, 15, 18, 15, 18
    ]
}, {
    name: 'Manufacturing',
    data: [
     
      17, 16, 15, 18, 15, 18, 17 ,25, 20, 18, 21, 15
    ]
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

}
