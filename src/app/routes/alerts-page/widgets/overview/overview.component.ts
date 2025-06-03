import { OnInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule, MatIconModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  chartValue=250;
  constructor(private renderer: Renderer2, private el: ElementRef) {}
  public element: any;
  chartData = [
    { name: 'Pending', y: 50, color:'#5654D4' },
    { name: 'Recent', y: 4 , color:'#11428C'},
    { name: 'Resolved', y: 68,color:'#FFC90A' },
    { name: 'Ongoing', y: 10,color:'#1DBF73' }
  ];
Highcharts: typeof Highcharts = Highcharts;

fillColor='white';
pendingColor=this.chartData[0].color;
recentColor=this.chartData[1].color;
resolveColor=this.chartData[2].color;
ongoingColor=this.chartData[3].color;

chartOptions: Highcharts.Options = {
  chart: {
    type: 'pie',
    spacingBottom:0,
    marginBottom:0,
    spacingLeft:0,
    spacingRight:0,
  },
  title: {
    text: ''
  },
  plotOptions: {
    pie: {
      innerSize: '80%',
      dataLabels: {
        enabled: false,
        format: '{point.name}: {point.y}',
        connectorWidth: 0
      }
    }
  },
  credits: {
    enabled: false
  },
  series: [{
    type: 'pie',
    name: 'Count',
    data: this.chartData
  }] as Highcharts.SeriesOptionsType[] 
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

