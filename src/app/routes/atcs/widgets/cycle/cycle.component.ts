import { OnInit, Component,inject, Input,ElementRef, SimpleChanges,Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule} from '@angular/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { withLoader } from '../../../../services/common/common';
import { atcsDashboardservice } from '../../../../services/atcs/atcsdashboard.service';

@Component({
    selector: 'app-cycle',
    imports: [HighchartsChartModule, CommonModule],
    templateUrl: './cycle.component.html',
    styleUrl: './cycle.component.css'
})
export class CycleComponent implements OnInit {

  
  loaderService=inject(LoaderService)
  @Input() junctionName!: string;
      @Input() fromDate!: Date | null;
  @Input() toDate!: Date | null;
  @Input() zoneIds: number[] = [];

  cycleData: any[] = [];
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


  getCycleData() {
    const start = this.fromDate ? this.fromDate.toISOString() : '';
    const end = this.toDate ? this.toDate.toISOString() : '';

    this.service.getCycleTimeData(this.zoneIds, start, end).pipe(withLoader(this.loaderService)).subscribe({
      next: (res:any) => {
        if (res && res.success) {
          this.cycleData = res.result; // Store the array of objects
          console.log('Cycle Time Data Stored:', this.cycleData);
          
          // Fix: Render the chart immediately after data is fetched
          this.updateChartForSelectedJunction();
        }
      }
    });
  }
      
  fetchCycleData(junctionId: string): void {
    debugger;
    // If junctionId is null or empty → use 0
  const jId = junctionId ? junctionId : "0";

  // Today's date in ISO format
  const todayISO = new Date().toISOString();

  // If this.fromDate is null → use today
  const fromDate = this.fromDate
      ? new Date(this.fromDate).toISOString()
      : todayISO;

  // If this.toDate is null → use today
  const toDate = this.toDate
      ? new Date(this.toDate).toISOString()
      : todayISO;

  this.service.getJunctioneData(jId,fromDate,toDate).pipe(withLoader(this.loaderService)).subscribe(
    (res: any) => {
      
      const data = res?.result || []; 
        // Always create a new jsonData reference
        this.jsonData = { data: [...data] };

        // Update chartOptions with a new series array reference
        this.chartOptions = {
          ...this.chartOptions,
          series: [{
            type: 'area',
            name: 'Cycle Time',
            data: this.jsonData.data.map((item: any) => ({
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
  // 1. If Dates or Zone IDs change, we MUST fetch fresh data from the server
  const apiInputsChanged = changes['fromDate'] || changes['toDate'] || changes['zoneIds'];
  
  if (apiInputsChanged && this.fromDate && this.toDate && this.zoneIds.length > 0) {
    console.log('Fetching fresh cycle data due to date/zone change');
    this.getCycleData(); 
  } 
  // 2. If only junctionName changed (and we aren't already fetching new data), 
  // just update the chart from the already stored this.allCycleData
  else if (changes['junctionName'] && !apiInputsChanged) {
    console.log('Filtering stored data for junction:', this.junctionName);
    this.updateChartForSelectedJunction();
  }
}

updateChartForSelectedJunction() {
  if (!this.cycleData.length) return;

  debugger;

  console.log('Updating chart for junction:', this.junctionName);
  console.log('Total stored cycle data entries:', this.cycleData.length);

  // Filter the stored data based on the junction name/ID
  // Adjust the 'item.junctionName' check to match your API string exactly
  const filteredData = this.cycleData.filter((item: any) => 
    item.junctionName.includes(this.junctionName) || this.junctionName === 'All'
  );

  // Patch the data as requested
  this.jsonData = { data: [...filteredData] };
  console.log('Filtered Data for Junction:', filteredData,this.jsonData);

  // Update chartOptions with a new series reference
  this.chartOptions = {
    ...this.chartOptions,
    series: [{
      type: 'area',
      name: 'Cycle Time',
      data: this.jsonData.data.map((item: any) => ({
        name: item.sequenceNo,
        y: Number(item.cycleTime),
        sequenceNo: item.sequenceNo,
        RTC: item.RTC
      }))
    }]
  };
}

}

