import { OnInit, Component,inject, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { withLoader } from '../../../../services/common/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { SessionService } from '../../../../services/common/session.service';
import { vmsdashboardService } from '../../../../services/dashboard/vmsDashboard.service';
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
     loaderService = inject(LoaderService);
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef,private service:vmsdashboardService,private session: SessionService) {}
  public element: any;

// jsonData: ChartSeries[] = [
//   { name: "Occupied", data: [30,40,35,45,30], color: '#5DBAE8' },
//   { name: "Empty", data: [25,35,30,30,25], color: '#FFAD5C' }
// ];

// Highcharts: typeof Highcharts = Highcharts;
//   chartOptions: Highcharts.Options = {
//     chart: {
//       type: 'scatter',
//       backgroundColor: 'transparent',  // Transparent background
        
//     },
//     title: {
//       text: '',
//       align: 'left'
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
//           enabled: false,
//           // format: '{point.percentage:.0f}%',
//           formatter: function () {
//         //    console.log(this);
//             return `<div style="color: ${this.color};"> ${this.y} </div>`;
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
//   series: this.jsonData.map(seriesItem => ({
//     name: seriesItem.name,
//     data: seriesItem.data,
//     color: seriesItem.color,
//     type: 'scatter'
//   })) as Highcharts.SeriesOptionsType[],
//   responsive: {
//       rules: [{
//           condition: {
//               maxWidth: 500
//           },
//           chartOptions: {
//               legend: {
//                   layout: 'horizontal',
//                   align: 'center',
//                   verticalAlign: 'top'
//               }
//           }
//       }]
//   }
//   };




  jsonData: ChartSeries[] = [];
  categories: string[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  // Example of your API Response
  apiResponse = {
    "result": {
      "LULU123": { "occupied": 32, "available": 18, "capacity": 50 },
      "LULU2": { "occupied": 1, "available": 0, "capacity": 1 },
      "TVM_004": { "occupied": 2, "available": 18, "capacity": 20 },
        "LULU1234": { "occupied": 2, "available": 11, "capacity": 13 },
      "LULU24": { "occupied": 1, "available": 0, "capacity": 1 },
      "TVM_0044": { "occupied": 2, "available": 18, "capacity": 20 }
    }
  };

  ngOnInit(): void {
//  this.processApiData(this.apiResponse);
 this.GetParkingOccupancySummary();
  } 
processApiData(apiResponse: any) {
  const result = apiResponse.result;
  if (!result) return;

  this.categories = Object.keys(result);

  const occupiedData = this.categories.map(key => result[key].occupied);
  const availableData = this.categories.map(key => result[key].available);

  this.jsonData = [
    { name: "Occupied", data: occupiedData, color: '#5DBAE8' },
    { name: "Empty", data: availableData, color: '#FFAD5C' }
  ];

  this.chartOptions = {
    chart: {
      type: 'scatter',
      height: 200, // Slightly increased height for better spacing
      backgroundColor: 'transparent'
    },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: this.categories,
      labels: {
        rotation: -45, // Rotates labels if you have many sites to prevent overlap
        style: { fontSize: '10px' }
      }
    } as any,
    yAxis: {
      title: { text: '' },
      min: 0,
      max: 50, // Set this higher than your max capacity (LULU123 is 32)
      tickAmount: 6, // Controls the number of horizontal grid lines
      gridLineColor: '#f0f0f0',
      labels: { style: { fontSize: '10px' } }
    },
    tooltip: {
      useHTML: true,
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: '{series.name}: <b>{point.y}</b>' // Shows "Occupied: 32" instead of "y: 32"
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 7, // Larger dots for easier interaction
          symbol: 'circle'
        }
      }
    },
    series: this.jsonData.map(s => ({
      name: s.name,
      data: s.data,
      color: s.color,
      type: 'scatter'
    })) as Highcharts.SeriesOptionsType[]
  };
}
GetParkingOccupancySummary() {
  const selectedSites = ['TVM_004', 'LULU2', 'LULU123']; 
  const fromDate = '2024-12-19';
  const toDate = '2025-12-19';

  this.service
    .GetParkingOccupancySummaryPerLot(selectedSites, fromDate, toDate)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (response: any) => {
        // FIX: Change '!response.success' to 'response.success'
        if (response && response.success) {
          this.processApiData(response);
        } else {
          console.warn('API returned success: false', response);
        }
      },
      error: (err) => {
        console.error('Error fetching parking occupancy summary', err);
      }
    });
}

}