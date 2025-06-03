import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-weekly-overview',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './weekly-overview.component.html',
  styleUrl: './weekly-overview.component.css'
})
export class WeeklyOverviewComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent'  // Transparent background
    },
    title: {
      text: 'Weekly Overview',
      align: 'center'
  },
  tooltip: {
    useHTML: true,
    shadow: false,
    backgroundColor: '#FFDFC0',
    style:{
      color:'#E88B2E',
      cursor:'default',
      fontSize:'0.8em'
      },
    headerFormat: '',
    pointFormat: `<div>{point.y}</div>`
  },
  subtitle: {
      text:'Apr 10 - Apr 17'},
  
  yAxis: {
      title: {
          text: ''
      },
      min: 0,
       gridLineColor: 'transparent',
       labels: {
        enabled: false
    }
  },

  xAxis: {
    categories: ['M', 'T', 'W', 'T', 'F', 'S',
      'S'],
       lineColor: 'transparent'
  },

  legend: {
      enabled :false
  },
  plotOptions: {
    column: {
      pointPadding: 0.1,
      borderWidth: 0,
    borderRadius: '50%',
    dataLabels: {
      enabled: false,
      style:{
        color:'#E88B2E',
        border:'0'
      }
  }
  },
      series: {
          label: {
              connectorAllowed: false
          },
          pointStart: 0
      },
           
  },

  credits: {
    enabled: false
  },
  series: [{
    // name: 'Installation & Developers',
    color: '#98DDFF',
    data: [
         70, 120, 50, 140, {y: 100, color: '#FF9933'}, 100,100
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
