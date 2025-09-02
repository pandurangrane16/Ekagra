import { OnInit, Input,Component,OnChanges,inject, SimpleChanges,ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { atcsDashboardservice } from '../../../../services/atcs/atcsdashboard.service';
import { LoaderService } from '../../../../services/common/loader.service';
import { withLoader } from '../../../../services/common/common';

@Component({
    selector: 'app-failures',
    imports: [HighchartsChartModule, CommonModule],
    templateUrl: './failures.component.html',
    styleUrl: './failures.component.css'
})
export class FailuresComponent implements OnInit,OnChanges {

  loaderService=inject(LoaderService)

  
    @Input() fromDate!: Date | null;
  @Input() toDate!: Date | null;
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef, private service:atcsDashboardservice) {}
  public element: any;
  colors: string[] = [
  '#344BFD', '#66CC66', '#53CEE7', '#FFD200', '#FC4F64',
  '#8A2BE2', '#FF7F50', '#20B2AA', '#9370DB', '#DC143C', '#FF8C00'
];

public jsonData: { data: { name: string; y: number; color: string }[] } = {
  data: [
  
  ]
};



public updateFlag = false; 
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

  this.fetchFailureData();
}
      ngOnChanges(changes: SimpleChanges): void {
    // This will fire whenever parent updates fromDate or toDate
    if ((changes['fromDate'] || changes['toDate']) && this.fromDate && this.toDate) {
        this.fetchFailureData();
    }
  }


fetchFailureData(): void {
    // const fromDate = '2025-07-10 00:00:00';
    // const toDate = '2025-07-18 00:00:00';


    
      const fromDate = this.fromDate ? this.fromDate.toISOString() : '';
    const toDate   = this.toDate ? this.toDate.toISOString() : '';

    

    this.service.getFailureData(fromDate, toDate).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
      const rawData = response.result || [];

      const colors = ['#344BFD', '#66CC66', '#53CEE7', '#FFD200', '#FC4F64', '#FF5733', '#C70039', '#900C3F', '#581845', '#1ABC9C', '#2ECC71'];
      
      
      
      
      const formattedData = rawData.map((item: any, index: number) => ({
        name: item.AlertTitle,
        y: item.Issues,
        color: colors[index % colors.length]
      }));





      this.jsonData = { data: [...formattedData] };

//      this.chartOptions = {
//     chart: {
//       type: 'column',
//       backgroundColor: 'transparent',  // Transparent background
        
//     },
//     title: {
//       text: '',
//       align: 'left'
//   },
//   yAxis: {
//     title:{
//       text:''
//     },
//   },
//      legend: {
//         enabled:false,
//         layout: 'horizontal',
//         verticalAlign: 'bottom',
//         align: 'left',
//         labelFormatter: function() {
         
//                   return `<span style="color:${this.color}">${this.name}: </span><br/>`;
             
//       },
//         // symbolHeight: 25,
//         // symbolRadius: 5,
//         itemMarginTop: 10,
//         itemMarginBottom: 10,
//       },
   
//   plotOptions: {
//     column: {
//       allowPointSelect: true,
//       cursor: 'pointer',
//       dataLabels: [{
//           enabled: true,
//           useHTML: true,
//           formatter: function () {
//             return `
//               <div style="text-align: center; background-color:${this.color}; border-radius:50%;width:32px; height:32px;line-height:32px; margin-bottom:5px;">
                
//                 <span style="font-size: 10px; color:#fff">
//                   ${this.y}
//                 </span>
//               </div>
//             `;
//           },
//           style: {
//             fontSize: '0.9em',
//             background:'red',
//             borderRadius:50,
//             color:'black'
        
//       }
//     }],
//     //  showInLegend: true
//   }
      
      
//   },

//   credits: {
//     enabled: false
//   },
//   series: [{
//     innerSize: '50%',
//     borderRadius: 0,
//     data:this.jsonData.data,
// }] as Highcharts.SeriesOptionsType[] // Casting to SeriesOptionsType[]
//  ,
//   responsive: {
//       rules: [{
//           condition: {
//               maxWidth: 500
//           },
//           chartOptions: {
            
//               legend: {
//                   layout: 'horizontal',
//                   align: 'center',
//                   verticalAlign: 'bottom'
//               }
//           }
//       }]
//   }
//   };



      // Replace the series reference completely to force Highcharts update
      this.chartOptions = {
        ...this.chartOptions,  // keep all existing options
        series: [{
          type: 'column',
          data: [...formattedData]  // new array reference
        }]
      };
  // this.chartOptions.series = [{
  //   type: 'column',
  //   data: this.jsonData.data
  // }];

  // this.updateFlag = true; 

   this.updateFlag = true;
   
     
    });
  }




  } 


