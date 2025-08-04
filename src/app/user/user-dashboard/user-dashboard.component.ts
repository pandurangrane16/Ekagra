import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { ChartService } from '../../services/common/chart.service';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
@Component({
  selector: 'app-user-dashboard',
  imports: [MaterialModule, CommonModule, DragDropModule, ResizableModule, FormsModule, HighchartsChartModule, CmSelect2Component],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})

export class UserDashboardComponent implements OnInit {
  fb = inject(FormBuilder);
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any[] = [];
  width = 400;
  height = 300;
  group: any;
  typeSettings = {
    labelHeader: 'Select Type',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'fill',
    options: [{ name: "Chart", value: "0" }, { name: "Notification", value: "1" }, { name: "Static", value: "2" }]
  }

   chartTypeSettings = {
    labelHeader: 'Select Chart Type',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'fill',
    options: [{ name: "Bar", value: "0" }, { name: "Pie", value: "1" }]
  }

  constructor(private chartService: ChartService) {

  }
  ngOnInit(): void {
    this.group = this.fb.group({
      type: [''],
      chartType : [''],
    })
  }
  onProjectSelected(evt: any) {
    console.log(evt);
  }
}