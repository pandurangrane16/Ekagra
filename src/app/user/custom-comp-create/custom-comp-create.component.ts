import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { CmSelectComponent } from "../../common/cm-select/cm-select.component";
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartService } from '../../services/common/chart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-comp-create',
  imports: [CmSelectComponent, HighchartsChartModule,CommonModule,FormsModule],
  templateUrl: './custom-comp-create.component.html',
  styleUrl: './custom-comp-create.component.css'
})
export class CustomCompCreateComponent implements OnInit, OnChanges {
  height : number =  100;
  width : number = 200;
  pageConfig : any[] =[];
  constructor(private chartService : ChartService){}
  public selectParentId = {
    options: [{ "name": "--Select--", "value": "0", "selected": true }, { "name": "Graph", "value": "1", "selected": false },
    { "name": "Alert", "value": "2", "selected": false },
    { "name": "Scale", "value": "3", "selected": false }, { "name": "Content", "value": "4", "selected": false }
    ],

    appearance: "outline",
    color: "primary",
    formFieldClass: "w-100",
    isDisabled: false,
    labelClass: "f-w-600 m-b-8 d-block",
    labelHeader: "Select Type",
    placeholder: "Select Type",
    onContainerClick: () => { }
  };

  public selectChartType = {
    options: [{ "name": "--Select--", "value": "0", "selected": true }, { "name": "Bar", "value": "bar", "selected": false },
    { "name": "Line", "value": "line", "selected": false },
    { "name": "Pie", "value": "pie", "selected": false }],
    appearance: "outline",
    color: "primary",
    formFieldClass: "w-100",
    isDisabled: false,
    labelClass: "f-w-600 m-b-8 d-block",
    labelHeader: "Select Chart Type",
    placeholder: "Select Chart Type",
    onContainerClick: () => { }
  };

  ngOnInit(): void {
    console.log("In NgOnIt");
    this.chartOptions = {
      chart: {
        type: this.chartType as any
      },
      title: {
        text: `${this.chartType.toUpperCase()} Chart`
      },
      xAxis: {
        categories: this.categories
      },
      series: [
        {
          name: 'User Data',
          type: this.chartType as any,
          data: this.data
        }
      ]
    };
  }
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  category: number = 0;
  divs: { content: string }[] = [];

  @Input() chartType: string = 'bar';
  @Input() data: any[] = [1, 2, 3];
  @Input() categories: string[] = ['A', 'B', 'C'];

  ngOnChanges(): void {
    console.log("In NgOnChanges");
    this.chartOptions = {
      chart: {
        type: this.chartType as any
      },
      title: {
        text: `${this.chartType.toUpperCase()} Chart`
      },
      xAxis: {
        categories: this.categories
      },
      series: [
        {
          name: 'User Data',
          type: this.chartType as any,
          data: this.data
        }
      ]
    };


  }

  onTypeSelect(val: any) {
    this.category = val;
  }
  onChartTypeSelect(val: any) {
    this.chartType = val;
    if (val == "pie") {
      this.data = [60,25,10 ];

     let series= [
        {
          name: 'User Data',
          type: this.chartType as any,
          data: this.chartType === 'pie' ? this.data as any : (this.data as any)
        }
      ]
    }
    this.ngOnChanges();
  }
  AddNew(){
    const newContent = `This is div number ${this.divs.length + 1}`;
    this.divs.push({ content: newContent });
  }
  AddToList() {
    const config = {
      type: this.chartType,
      categories: this.categories,
      data: this.data.map(Number)
    };

    this.pageConfig.push(config);
  }
  saveChart() {
    
    this.chartService.saveChartConfig(this.pageConfig);
    alert('Chart Saved!');
  }
  onResizeEnd(event: any) {
    this.width = event.rectangle.width;
    this.height = event.rectangle.height;
  }

  removeDiv(index: number) {
    this.divs.splice(index, 1);
  }
}
