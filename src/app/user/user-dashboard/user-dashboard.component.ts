import { Component } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { ChartService } from '../../services/common/chart.service';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';
// import Highcharts3d from 'highcharts/highcharts-3d';
// Highcharts3d(Highcharts);
@Component({
  selector: 'app-user-dashboard',
  imports: [MaterialModule,CommonModule,DragDropModule,ResizableModule,FormsModule,HighchartsChartModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
// export class UserDashboardComponent
//   {
//     widgets = [
//       { type: 'alert', time: '4 hours' },
//       { type: 'status', title: 'ATCS', value: '30.1%' },
//       { type: 'status', title: 'Surveillance', value: '30.1%' },
//       { type: 'status', title: 'Air Quality', value: '30.1%' },
//       { type: 'status', title: 'Parking', value: '30.1%' },
//       { type: 'status', title: 'Alert Action & SOP', value: '30.1%' },
//       { type: 'chart' },
//       { type: 'notification' },
//       { type: 'map' }
//     ];
  
//     drop(event: any) {
//       moveItemInArray(this.widgets, event.previousIndex, event.currentIndex);
//     }
//   }

export class UserDashboardComponent {
  // widgets = [
  //   {
  //     type: 'status',
  //     title: 'ATCS',
  //     value: '30.1%',
  //     position: { x: 0, y: 0 },
  //     width: 200,
  //     height: 150
  //   },
  //   {
  //     type: 'status',
  //     title: 'Parking',
  //     value: '40.5%',
  //     position: { x: 250, y: 100 },
  //     width: 200,
  //     height: 150
  //   }
  // ];

  // onDragEnd(event: any, widget: any) {
  //   widget.position = event.source.getFreeDragPosition();
  // }

  // onResizeEnd(event: ResizeEvent, widget: any): void {
  //   if (event.rectangle.width && event.rectangle.height) {
  //     widget.width = event.rectangle.width;
  //     widget.height = event.rectangle.height;
  //   }
  // }

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any[] =[] ;
  width = 400;
  height = 300;

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    const config = this.chartService.getChartConfig();
    console.log(config);
    if (config) {
      config.forEach((ele:any) => {
        let chartMap :Highcharts.Options = {}

      chartMap = {
        chart: {
          type: ele.type,
           options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
              }
        },
        title: {
          text: `${ele.type.toUpperCase()} Chart`
        },
        xAxis: {
          categories: ele.categories
        },
        series: [
          {
            type: ele.type,
            data: ele.data,
            name: 'User Data'
          }
        ]
      };
      this.chartOptions.push(chartMap);
      });
    }
  }

  onResizeEnd(event: any) {
    this.width = event.rectangle.width;
    this.height = event.rectangle.height;
  }
}