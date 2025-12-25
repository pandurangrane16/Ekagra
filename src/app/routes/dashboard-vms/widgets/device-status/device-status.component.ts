import { OnInit,inject, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { withLoader } from '../../../../services/common/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { SessionService } from '../../../../services/common/session.service';
import { vmsdashboardService } from '../../../../services/dashboard/vmsDashboard.service';

@Component({
  selector: 'app-device-status',
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './device-status.component.html',
  styleUrl: './device-status.component.css'
})

export class DeviceStatusComponent implements OnInit {
     loaderService = inject(LoaderService);
  @ViewChild('customLegend')
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef,private service:vmsdashboardService,private session: SessionService ) {}
  public element: any;
  legendData: any[] = [];
  jsonData = {
    "data": [
        { "name": "Active", "y": 66, "color": "#05da4cff"},
        { "name": "Inactive", "y": 76, "color": "#98DDFF"},
    ]
};
Highcharts: typeof Highcharts = Highcharts;
chartOptions?: Highcharts.Options; 
//   chartOptions: Highcharts.Options = {
//     chart: {
//       type: 'pie',
//       backgroundColor: 'transparent',  // Transparent background
//       events: {
//         render: function () {
//           const chart = this as Highcharts.Chart & { customLabel?: Highcharts.SVGElement };

//           // Calculate total
//          const total = chart.series[0].data.reduce(
//             (sum, point) => sum + (point.y ?? 0),
//             0
//           );
//           const text = `Total Device<br><b>${total}</b>`;

//           // Remove existing label before re-rendering
//           if (chart.customLabel) {
//             chart.customLabel.destroy();
//           }

//           // Add the label
//           chart.customLabel = chart.renderer
//             .text(
//               text,
//               chart.plotWidth / 2 + chart.plotLeft,
//               chart.plotHeight / 2 + chart.plotTop
//             )
//             .css({
//               color: '#333',
//               textAlign: 'center',
//               fontSize: '16px'
//             })
//             .attr({
//               align: 'center',
//               zIndex: 5
//             })
//             .add();

//           // Center align the label
//           const bbox = chart.customLabel.getBBox();
//           chart.customLabel.attr({
//             x: chart.plotLeft + chart.plotWidth / 2 ,
//             y: chart.plotTop + chart.plotHeight / 2
//           });
//         }
//       }

        
//     },
//     title: {
//       text: '',
//       align: 'left'
//   },
//   tooltip: {
//       useHTML: true,
//     backgroundColor:'transparent',
// 	borderColor: '#9ab',
// 		formatter: function() {
//        const color = this.color || this.series.color;
// 			return 	`<div style="
//           background-color: white;
//           color: #000;
//           padding: 8px 12px;
//           border-radius: 4px;
//           border:1px solid #ccc;
//           box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; text-align:center
//         ">
//           ${this.name}<br/>
//           <strong style="font-size:14px">${this.y}</strong>
//         </div>`;
// 		},
// 		style: {
// 			 zIndex: 999,
//         pointerEvents: 'auto', // Make sure it can be interacted with,
//          padding: '0px',
//     boxShadow: 'none'
// 		}
//        // pointFormat: '{series.name} <b>{point.y}</b>',
//   },
 
//    legend: {
//         enabled:false,
//         layout: 'vertical',
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
//     pie: {
//       allowPointSelect: true,
//       cursor: 'pointer',
//       dataLabels: [{
//           enabled: true,
//           // format: '{point.percentage:.0f}%',
//           connectorShape: 'none',
//           distance: -10, 
//           useHTML: true,
//           formatter: function () {
//             return `
//               <div style="text-align: center; background-color:#ECEAF8; border-radius:50%;width:32px; height:32px;line-height:32px">
                
//                 <span style="font-size: 10px;">
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
//       showInLegend: true
//   }
      
      
//   },

//   credits: {
//     enabled: false
//   },
//   series: [{
//     innerSize: '75%',
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

 

  ngOnInit(): void {
   this.getDeviceStatus();
  } 
// getDeviceStatus() {
//   const requestPayload = {
//     projectId: 2,
//     type: 0,
//     inputs: 'string',
//     bodyInputs: 'string',
//     seq: 6
//   };

//   this.service
//     .PostSiteResponse(requestPayload)
//     .pipe(withLoader(this.loaderService))
//     .subscribe({
//       next: (response: any) => {
//         const result = response?.result ? JSON.parse(response.result) : null;

//         if (result?.deviceData) {
//           const active = parseInt(result.deviceData.active, 10);
//           const inactive = parseInt(result.deviceData.inActive, 10);

//           // ✅ Just update chart data dynamically
//           const newData = [
//             { name: 'Active', y: active, color: '#05da4cff' },
//             { name: 'Inactive', y: inactive, color: '#98DDFF' }
//           ];

//           // Update only the data field in existing chart options
//           if (this.chartOptions.series && this.chartOptions.series[0]) {
//             (this.chartOptions.series[0] as Highcharts.SeriesPieOptions).data = newData;
//           }

//           // Force Angular to detect the change for Highcharts
//           this.chartOptions = { ...this.chartOptions };
//         } else {
//           console.warn('⚠️ No deviceData found in API response');
//         }
//       },
//       error: (err) => {
//         console.error('❌ Error fetching device status:', err);
//       }
//     });
// }

getDeviceStatus() {

debugger;

 const projectCodesStr = this.session._getSessionValue("projectCodes");
const projectCodes = projectCodesStr ? JSON.parse(projectCodesStr) : [];

  // ✅ Identify current project (example: VMS)
  const currentProject = "vms";
debugger;
  const project = projectCodes.find(
    (p: any) => p.name.toLowerCase() === currentProject.toLowerCase()
  );
debugger;
  if (!project) {
    console.error(`⚠️ Project "${currentProject}" not found in config.`);
    return;
  }

const projectId = Number(project.value);

const requestPayload = {
  projectId,
  type: 0,
  inputs: 'string',
  bodyInputs: 'string',
  seq: 6
};

    this.service
      .PostSiteResponse(requestPayload)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (response: any) => {
          const result = response?.result ? JSON.parse(response.result) : null;

          if (result?.deviceData) {
            const active = parseInt(result.deviceData.active, 10);
            const inactive = parseInt(result.deviceData.inActive, 10);
            this.initializeChart(active, inactive); // ✅ Only build chart after API success
          } else {
            console.warn('⚠️ No deviceData found in API response');
          }
        },
        error: (err) => {
          console.error('❌ Error fetching device status:', err);
        }
      });
  }

  initializeChart(active: number, inactive: number) {

      this.legendData = [
    { name: 'Active', y: active, color: '#05da4cff' },
    { name: 'Inactive', y: inactive, color: '#98DDFF' }
  ];
    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        events: {
          render: function () {
            const chart = this as Highcharts.Chart & { customLabel?: Highcharts.SVGElement };
            const total = chart.series[0].data.reduce(
              (sum, point) => sum + (point.y ?? 0),
              0
            );
            const text = `Total Device<br><b>${total}</b>`;

            if (chart.customLabel) chart.customLabel.destroy();

            chart.customLabel = chart.renderer
              .text(
                text,
                chart.plotWidth / 2 + chart.plotLeft,
                chart.plotHeight / 2 + chart.plotTop
              )
              .css({
                color: '#333',
                textAlign: 'center',
                fontSize: '16px'
              })
              .attr({ align: 'center', zIndex: 5 })
              .add();

            chart.customLabel.attr({
              x: chart.plotLeft + chart.plotWidth / 2,
              y: chart.plotTop + chart.plotHeight / 2
            });
          }
        }
      },
      title: { text: '', align: 'left' },
      tooltip: {
        useHTML: true,
        backgroundColor: 'transparent',
        borderColor: '#9ab',
        formatter: function () {
          return `<div style="
              background-color: white;
              color: #000;
              padding: 8px 12px;
              border-radius: 4px;
              border:1px solid #ccc;
              box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
              text-align:center
            ">
            ${this.name}<br/>
            <strong style="font-size:14px">${this.y}</strong>
          </div>`;
        }
      },
      legend: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [{
            enabled: true,
            connectorShape: 'none',
            distance: -10,
            useHTML: true,
            formatter: function () {
              return `
                <div style="text-align: center; background-color:#ECEAF8;
                  border-radius:50%;width:32px; height:32px;line-height:32px">
                  <span style="font-size: 10px;">${this.y}</span>
                </div>`;
            },
            style: { fontSize: '0.9em', color: 'black' }
          }],
          showInLegend: true
        }
      },
      credits: { enabled: false },
      series: [{
        innerSize: '75%',
        borderRadius: 0,
        data: [
          { name: 'Active', y: active, color: '#05da4cff' },
          { name: 'Inactive', y: inactive, color: '#98DDFF' }
        ]
      }] as Highcharts.SeriesOptionsType[]
    };}



}
