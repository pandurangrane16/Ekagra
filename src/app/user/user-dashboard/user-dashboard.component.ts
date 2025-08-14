import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDragEnd, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { ChartService } from '../../services/common/chart.service';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent, HighchartsChartModule } from 'highcharts-angular';
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { HttpClient } from '@angular/common/http';
import { atcsDashboardservice } from '../../services/atcs/atcsdashboard.service';
import { SessionService } from '../../services/common/session.service';
//import HCExporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-user-dashboard',
  imports: [MaterialModule, CommonModule, DragDropModule, ResizableModule, FormsModule, CmInputComponent
    , CmSelect2Component, CmInputComponent, HighchartsChartModule, DragDropModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
  //providers :[HCExporting]
})

export class UserDashboardComponent implements OnInit {
  @ViewChild(HighchartsChartComponent) chartComponent: HighchartsChartComponent;
  fb = inject(FormBuilder);
   service=inject(atcsDashboardservice);
  Highcharts: typeof Highcharts = Highcharts;
  //chartOptions: any[] = [];
  width = 400;
  showChart: boolean = false;
  height = 300;
  maxheight: number = 900;
  maxwidth: number = 1500;
  group: any;
  session = inject(SessionService);

  typeSettings = {
    labelHeader: 'Select Type',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'fill',
    options: [{ name: "Chart", value: "0" }, { name: "Notification", value: "1" }, { name: "Static", value: "2" }]
  }
  heightSettings = {
    labelHeader: 'Height',
    placeholder: '(px)',
    formFieldClass: 'cm-square-input',
    isDisabled: false
  };

  widthSettings = {
    labelHeader: 'Width',
    placeholder: '(px)',
    formFieldClass: 'cm-square-input',
    isDisabled: false
  };
  chartTypeSettings = {
    labelHeader: 'Select Chart Type',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'fill',
    options: [{ name: "Bar", value: "bar" }, { name: "Line", value: "line" }, { name: "Pie", value: "pie" }]
  }
  inputFields = {
    apiUrl: {
      labelHeader: '',
      placeholder: 'API URL',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    notiHeader: {
      labelHeader: '',
      placeholder: 'Header',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    staticHeader: {
      labelHeader: '',
      placeholder: 'Header',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    }
  }
  alertsData: any[] = [];
  constructor(private chartService: ChartService) {

  }

  ngOnInit(): void {
    this.group = this.fb.group({
      height: [],
      width: [],
      type: [''],
      chartType: [''],
      notiHeader: [],
      staticHeader: [],
      apiUrl: [''],
      groups: this.fb.array([]),
    });
    //this.createChart();
    this.fetchAlerts();
  }
  get groupsFormArray(): FormArray<FormGroup> {
    return this.group.get('groups') as FormArray<FormGroup>;
  }
  createChart() {
    let len = this.group.controls['groups'].length;
    if (this.group.controls["chartType"].value.value == "line")
      this.chartOptions = this.lineChartData();
    else if (this.group.controls["chartType"].value.value == "bar")
      this.chartOptions = this.barChartData();
    else if (this.group.controls["chartType"].value.value == "pie")
      this.chartOptions = this.pieChartData();

    const grp = this.fb.group({
      seqNo: [{ value: (len == undefined ? 1 : len + 1), disabled: true }],
      chartOptions: [this.chartOptions],
      type : [this.group.controls["type"].value],
      position: [{ x: 0, y: 0 }],
      notiHeader : [this.group.controls["notiHeader"].value],
      staticHeader : [this.group.controls["staticHeader"].value],
    });
    console.log(grp);
    this.groupsFormArray.push(grp);
  }
  onProjectSelected(evt: any) {
    console.log(evt);
  }

  http = inject(HttpClient);
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'line',
      // ...other chart-specific options,
      // DO NOT include 'responsive' here!
    },
    title: { text: 'Dynamic Chart' },
    series: [],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              enabled: false
            }
          }
        }
      ]
    }
  };

  dragPosition = { x: 0, y: 0 };

  onDragEnd(index: any, event: any): void {
    this.dragPosition = event.source.getFreeDragPosition();
    const position = event.source.getFreeDragPosition();
    this.groupsFormArray.at(index).patchValue({ position });
  }

  onChartTypeChange(type: string) {
    this.chartOptions = { ...this.chartOptions, chart: { ...this.chartOptions.chart, type } };
  }
  barChartData() {
    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Top 5 Products Sold'
      },
      xAxis: {
        categories: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Units Sold',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        type: 'bar',
        name: 'Units',
        data: [107, 31, 635, 203, 250]
      }]
    };
    return chartOptions;
  }
  lineChartData(): Highcharts.Options {
    let data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [29, 71, 106, 129, 144, 176]
    };

    this.chartOptions = {
      ...this.chartOptions,
      xAxis: { categories: data.labels },
      series: [{
        type: "line",
        data: data.values
      }]
    };

    return this.chartOptions;
  }
  pieChartData(): Highcharts.Options {
    //HCExporting(Highcharts); 
    return {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Browser market shares'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [
        {
          name: 'Browsers',
          type: 'pie',
          data: [
            { name: 'Chrome', y: 63.59 },
            { name: 'Edge', y: 12.21 },
            { name: 'Firefox', y: 8.12 },
            { name: 'Safari', y: 7.6 },
            { name: 'Other', y: 8.48 }
          ]
        }
      ]
    };
  }

  fetchData() {
    this.maxheight = this.group.controls["height"].value;
    this.maxwidth = this.group.controls["width"].value;
    this.showChart = false;

    this.createChart();
    // Trigger chart reflow after view updates
    setTimeout(() => {
      //this.chartRef?.reflow();
      this.showChart = true;
    }, 1000);
  }
  chartRef: any;
  chartCallback = (chart: any) => {
    this.chartRef = chart;
  };
  onResize() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize')); // Ensures Highcharts calls reflow
    }, 100);
  }
  private resizing = false;
  startResizing(event: MouseEvent) {
    this.resizing = true;
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = this.width;
    const startHeight = this.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (this.resizing) {
        this.width = startWidth + (moveEvent.clientX - startX);
        this.height = startHeight + (moveEvent.clientY - startY);

        // Let Angular update, then reflow the chart
        setTimeout(() => {
          if (this.chartRef) {
            this.chartRef.reflow();
          }
        });
      }
    };

    const onMouseUp = () => {
      this.resizing = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      // One last reflow to be sure:
      if (this.chartRef) {
        this.chartRef.reflow();
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  showAlertDetails(alertData: any) {
    //alert(JSON.stringify(alertData, null, 2));
  }

  fetchAlerts(): void {
    const from = '2025-07-01 04:28:01.785';
    const to = '2025-07-23 04:28:01.786';
    const defaultImg = 'assets/img/icon_user.png';
    this.service.getAlerts(from, to).subscribe({
      next: (data) => {
        console.log("hi2", data);

        this.alertsData = data.result;
        this.alertsData = (data.result || []).map((alert: any) => ({
          ...alert,
          img: defaultImg
        }));

        console.log("hi3", this.alertsData);
      },
      error: (err) => {
        console.error('Error fetching alerts:', err);
      }
    });
  }

  submit() {
    this.session._setSessionValue("DashboardForm",JSON.stringify(this.group.value));
  }
}