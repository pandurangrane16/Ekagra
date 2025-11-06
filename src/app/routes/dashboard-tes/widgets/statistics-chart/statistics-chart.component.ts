import { OnInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics-chart',
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './statistics-chart.component.html',
  styleUrl: './statistics-chart.component.css'
})

export class StatisticsChartComponent implements OnInit {
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef) {}
  public element: any;
  jsonData = {
    "data": [
        { "name": "DOUBLEPARK", "y": 30, "color": "#ff6347"},
        { "name": "FOOTPATHDRIVE", "y": 40, "color": "#4682b4"},
        { "name": "FREELEFT", "y": 25, "color": "#32cd32"},
        { "name": "MOBILEUSE", "y": 50, "color": "#ffd700"},
        { "name": "NOHELMET", "y": 30, "color": "#ff98f6ff"},
        { "name": "NOPARK", "y": 20, "color": "#004f4f"},
        { "name": "NOSEATBELT", "y": 10, "color": "#ff1493"},
        { "name": "OVERSPEED", "y": 10, "color": "#8a2be2"},
        { "name": "RASHDRIVE", "y": 30, "color": "#20b2aa"},
        { "name": "REDLIGHT", "y": 10, "color": "#dc143c"},
        { "name": "STOPLINE", "y": 10, "color": "#999966"},
        { "name": "TRIPLERIDE", "y": 5, "color": "#00006e"},
        { "name": "WRONGDIRECTION", "y": 3, "color": "#ff8c00"},
        { "name": "WRONGLANE", "y": 2, "color": "#ff6347"},
    ]
};
Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',  // Transparent background
      height:180,
      spacingBottom:0,
      marginBottom:0,
      spacingTop:0,
      marginTop:0,
      events: {
        render: function () {
          const chart = this as Highcharts.Chart & { customLabel?: Highcharts.SVGElement };

          // Calculate total
         const total = chart.series[0].data.reduce(
            (sum, point) => sum + (point.y ?? 0),
            0
          );
          const text = `Total <br/><b style="font-size: 40px;">${total}</b>`;

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
    innerSize: '80%',
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
