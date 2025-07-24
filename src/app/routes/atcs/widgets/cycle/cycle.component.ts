import { OnInit, Component, Input,ElementRef, SimpleChanges,Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { atcsDashboardservice } from '../../../../services/atcs/atcsdashboard.service';

@Component({
    selector: 'app-cycle',
    imports: [HighchartsChartModule, CommonModule],
    templateUrl: './cycle.component.html',
    styleUrl: './cycle.component.css'
})
export class CycleComponent implements OnInit {
  @Input() junctionName!: string;
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef,private service:atcsDashboardservice) {}
  public element: any;
  jsonData: any = { data: [] };
//   jsonData = {
//    "data" : [
//   {
//     sequenceNo: "40",
//     cycleTime: "120",
//     RTC: "2025-06-16T09:17:59+05:30"
//   },
//   {
//     sequenceNo: "41",
//     cycleTime: "120",
//     RTC: "2025-06-16T09:30:00+05:30"
//   },
//   {
//     sequenceNo: "42",
//     cycleTime: "120",
//     RTC: "2025-06-16T09:45:00+05:30"
//   },
//   {
//     sequenceNo: "43",
//     cycleTime: "120",
//     RTC: "2025-06-16T10:00:00+05:30"
//   },
//     {
//     sequenceNo: "44",
//     cycleTime: "120",
//     RTC: "2025-06-16T09:17:59+05:30"
//   },
//   {
//     sequenceNo: "45",
//     cycleTime: "120",
//     RTC: "2025-06-16T09:30:00+05:30"
//   },
//   {
//     sequenceNo: "46",
//     cycleTime: "110",
//     RTC: "2025-06-16T09:45:00+05:30"
//   },
//   {
//     sequenceNo: "47",
//     cycleTime: "120",
//     RTC: "2025-06-16T10:00:00+05:30"
//   }
// ]
// };


Highcharts: typeof Highcharts = Highcharts;

chartOptions: Highcharts.Options = {
  chart: {
    type: 'area',
    backgroundColor: 'transparent'
  },
  title: {
    text: '',
    align: 'left'
  },
  legend: {
    enabled: false
  },
  xAxis: {
    title: {
      text: 'Sequence Number'
    },
    type: 'category',
    labels: {
      rotation: 0
    }
  },
  yAxis: {
    title: {
      text: 'Cycle Time'
    }
  },

tooltip: {
  useHTML: true,
  formatter: function () {
    const opts = this.options as any; 
    return `
      <b>Sequence No:</b> ${opts.sequenceNo}<br/>
      <b>Cycle Time:</b> ${this.y}<br/>
      <b>RTC:</b> ${opts.RTC}
    `;
  }
},
  plotOptions: {
    area: {
      marker: {
        enabled: false,
        symbol: 'circle',
        radius: 2,
        states: {
          hover: {
            enabled: true
          }
        }
      },
      lineWidth: 1,
      color: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, 'rgba(173, 183, 249,1)'],
          [0.7, 'rgba(173, 183, 249, 0.6)']
        ]
      },
      states: {
        hover: {
          lineWidth: 1
        }
      },
      threshold: null
    }
  },
  credits: {
    enabled: false
  },
  series: [{
    type: 'area',
    name: 'Cycle Time',
    data: this.jsonData.data.map((item:any) => ({
      name: item.sequenceNo,           // X-axis label
      y: Number(item.cycleTime),       // Y-axis value
      sequenceNo: item.sequenceNo,
      RTC: item.RTC
    }))
  }] as Highcharts.SeriesOptionsType[],
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


// Highcharts: typeof Highcharts = Highcharts;
//   chartOptions: Highcharts.Options = {
//     chart: {
//       type: 'pie',
//       backgroundColor: 'transparent',  // Transparent background
        
//     },
//     legend: {
//       enabled: false
//     },
//     xAxis: {
//     title: {
//       text: 'Sequence Number'
//     },
//     type: 'category',
//     labels: {
//       rotation: 0
//     }
//   },
//     yAxis:{
//       title: {
//         text: 'Cycle Time'
//     }
//     },
//     title: {
//       text: '',
//       align: 'left'
//   },
//   // subtitle:{
//   //   text:'Cycle Time',
//   // },
  
//   plotOptions: {
//     area: {
//       marker: {
//         enabled: false,
//         symbol: 'circle',
//         radius: 2,
//         states: {
//             hover: {
//                 enabled: true
//             }
//         }
//     },
//         lineWidth: 1,
//         color: {
//             linearGradient: {
//                 x1: 0,
//                 y1: 0,
//                 x2: 0,
//                 y2: 1
//             },
//             stops: [
//                 [0, 'rgba(173, 183, 249,1)'],
//                 [0.7, 'rgba(173, 183, 249, 0.6)']
//             ]
//         },
//         states: {
//             hover: {
//                 lineWidth: 1
//             }
//         },
//         threshold: null
//     }
// },
//   credits: {
//     enabled: false
//   },
//   series: [{
//     type: 'area',
//     data:this.jsonData.data,
//     pointStart: new Date().setHours(6, 0, 0, 0), // today at midnight
//     pointInterval: 2 * 3600 * 1000 // 2 hours in milliseconds
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

  ngOnInit(): void {
    console.log('Junction changed:', this.junctionName);
    
  } 
      
  fetchCycleData(junctionId: string): void {
        const fromDate = '2025-06-10 00:00:00';
    const toDate = '2025-07-18 00:00:00';
  this.service.getJunctioneData(2010,fromDate,toDate).subscribe(
    (res: any) => {
      
      const data = res?.result || []; 
  this.jsonData.data = data
  
      this.chartOptions = {
        ...this.chartOptions,
        series: [{
          type: 'area',
          name: 'Cycle Time',
          data: this.jsonData.data.map((item:any) => ({
            name: item.sequenceNo,
            y: Number(item.cycleTime),
            sequenceNo: item.sequenceNo,
            RTC: item.RTC
          }))
        }]
      };
      

   
      console.log('Chart updated with new data:', data);
    },
    error => {
      console.error('Error fetching cycle time:', error);
    }
  );
}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['junctionName']) {
      console.log('Received junctionName:', this.junctionName);
      this.fetchCycleData(this.junctionName);
    }
  }

}

