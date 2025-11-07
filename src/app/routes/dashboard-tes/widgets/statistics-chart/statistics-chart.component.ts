import { OnInit, Component, ElementRef, Renderer2, ViewChild, Input,  OnChanges,
  SimpleChanges } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics-chart',
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './statistics-chart.component.html',
  styleUrl: './statistics-chart.component.css'
})

export class StatisticsChartComponent implements OnInit, OnChanges  {
  @Input() chartTitle: string = '';
  @Input() chartHeight: number = 180;
  @Input() chartType: 'pie' | 'column' | 'bar' | 'line' = 'column';
  @Input() chartData: any[] = [];
  @Input() chartDataColors: any[] = [];
 @ViewChild('customLegend', { static: false }) customLegend!: ElementRef;
 
  public element: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  constructor(private renderer: Renderer2, private el: ElementRef) {}
 
 ngOnInit(): void {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartType'] || changes['chartTitle'] || changes['chartHeight']) {
      this.initializeChart();
    }
  }

   initializeChart() {
    this.chartOptions = {
      chart: {
      type: this.chartType as any,
      backgroundColor: 'transparent',  // Transparent background
      height:this.chartHeight,
      events: {
        render: function () {
          const chart = this as Highcharts.Chart & { customLabel?: Highcharts.SVGElement };

          if (chart.options.chart?.type !== 'pie') {
             if (chart.customLabel) {
              chart.customLabel.destroy();
              chart.customLabel = undefined;
            }
            return;
          }

          // Calculate total
         const total = chart.series[0].data.reduce(
            (sum, point) => sum + (point.y ?? 0),
            0
          );
          const text = `<span  *ngIf="chartType !== 'column'">Total <br/><b style="font-size: 40px;">${total}</b></span>`;

          // Remove existing label before re-rendering
          if (chart.customLabel) {
            chart.customLabel.destroy();
          }

          // Add the label
          chart.customLabel = chart.renderer
            .text(
              text,
              chart.plotWidth / 2 + chart.plotLeft,
              chart.plotHeight / 3 + chart.plotTop
            )
            .css({
              color: '#333',
              textAlign: 'center',
              fontSize: '16px'
            })
            .attr({
              align: 'center',
              zIndex: 5
            })
            .add();

          // Center align the label
          const bbox = chart.customLabel.getBBox();
          chart.customLabel.attr({
            x: chart.plotLeft + chart.plotWidth / 2 ,
            y: chart.plotTop + chart.plotHeight / 3
          });
        }
      }

        
    },
    title: {
      text: '',
      align: 'left'
  },
  xAxis: {
     title: {
      text: ''},
        type: 'category',
        labels: {
            autoRotation: [-45, -90],
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis:{
       title: {
      text: ''},
    },
  tooltip: {
      useHTML: true,
    backgroundColor:'transparent',
	borderColor: '#9ab',
		formatter: function() {
       const color = this.color || this.series.color;
			return 	`<div style="
          background-color: white;
          color: #000;
          padding: 8px 12px;
          border-radius: 4px;
          border:1px solid #ccc;
          box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; text-align:center
        ">
          ${this.name}<br/>
          <strong style="font-size:14px">${this.y}</strong>
        </div>`;
		},
		style: {
			 zIndex: 999,
        pointerEvents: 'auto', // Make sure it can be interacted with,
         padding: '0px',
    boxShadow: 'none'
		}
       // pointFormat: '{series.name} <b>{point.y}</b>',
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
      innerSize: '80%',
      cursor: 'pointer',
      dataLabels: [{
          enabled: false,
          // format: '{point.percentage:.0f}%',
          connectorShape: 'none',
          distance: -10, 
          useHTML: true,
          formatter: function () {
            return `
              <div style="text-align: center; background-color:#ECEAF8; border-radius:50%;width:32px; height:32px;line-height:32px">
                
                <span style="font-size: 10px;">
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
      showInLegend: true
  }
      
      
  },

  credits: {
    enabled: false
  },
  series: [{
     type: this.chartType as any,
     colors: this.chartDataColors,
        colorByPoint: true,
  //  innerSize: '80%',
     dataLabels: [{
          enabled: this.chartType !== 'pie',
            color: '#FFFFFF',
            inside: true,
            verticalAlign: 'top',}],
    borderRadius: 0,
    data:this.chartData,
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
    }
  }
}



