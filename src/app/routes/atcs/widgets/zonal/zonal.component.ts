import { OnInit, Input,Component,OnChanges, SimpleChanges,ElementRef, Renderer2, ViewChild, inject } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { withLoader } from '../../../../services/common/common';
import { atcsDashboardservice } from '../../../../services/atcs/atcsdashboard.service';

@Component({
    selector: 'app-zonal',
    imports: [HighchartsChartModule, CommonModule],
    templateUrl: './zonal.component.html',
    styleUrl: './zonal.component.css'
})
export class ZonalComponent implements OnInit, OnChanges {


    @Input() fromDate!: Date | null;
  @Input() toDate!: Date | null;


  
  loaderService=inject(LoaderService)

  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef,private service:atcsDashboardservice) {}
  public element: any;
public jsonData: { data: { name: string; y: number; color: string }[] } = {
  data: [
  
  ]
};
updateFlag = false; 
Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',  // Transparent background
        
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
          // formatter: function () {
          //  // console.log(this);
          //   return `<div style="color: ${this.color}; background-color:#ECEAF8; border:1px solid #000"> ${this.y} % </div>`;
          // },
          connectorShape: 'none',
          distance: -10, 
          useHTML: true,
          formatter: function () {
            return `
              <div style="text-align: center; background-color:#ECEAF8; border-radius:50%;width:32px; height:32px;line-height:32px">
                
                <span style="font-size: 10px;">
                  ${this.y}%
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

    ngOnChanges(changes: SimpleChanges): void {
    if ((changes['fromDate'] || changes['toDate']) && this.fromDate && this.toDate) {
      this.getUnprocessedConnectedCtrlData();
    }}

  getUnprocessedConnectedCtrlData(): void {
    const zoneNames = ['T1', 'T2', 'T3'];
  // const from = '2025-07-01 04:28:01.785';
  // const to = '2025-07-23 04:28:01.786';

    const from = this.fromDate ? this.fromDate.toISOString() : '';
  const to   = this.toDate ? this.toDate.toISOString() : '';

  console.log("from",from);
   console.log("to",to);

    this.service.getUnprocessedConnectedCtrlData(zoneNames,from, to).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
   const rawData = Object.values(response.result || {});

    // Step 1: Count occurrences of each Status
    const statusCountMap: { [key: string]: number } = {};
    rawData.forEach((item: any) => {
      const status = item.Status || 'Unknown';
      statusCountMap[status] = (statusCountMap[status] || 0) + 1;
    });

    const total = rawData.length;

    const colors = ['#344BFD', '#66CC66', '#53CEE7', '#FFD200', '#FC4F64', '#FF5733', '#C70039', '#900C3F', '#581845', '#1ABC9C', '#2ECC71'];

    // Step 2: Format data for chart
    const formattedData = Object.entries(statusCountMap).map(([status, count], index) => ({
      name: status,
      y: +(count / total * 100).toFixed(2), // percentage with 2 decimal places
      color: colors[index % colors.length]
    }));
  this.jsonData = { data: [...formattedData] };

//      this.chartOptions.series = [{
//        type: 'pie',
//     innerSize: '50%',
//     borderRadius: 0,
//     data:this.jsonData.data,
// }];



    this.chartOptions = {
        ...this.chartOptions,  // keep all existing options
        series: [{
          type: 'pie',
            innerSize: '50%',
    borderRadius: 0,
          data: [...formattedData]  // new array reference
        }]
      };



  this.updateFlag = true; 

 
   
     
    });
  }

  ngOnInit(): void {
   this.getUnprocessedConnectedCtrlData();
  } 

}
