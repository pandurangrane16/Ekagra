import { Component, Inject, PLATFORM_ID, TransferState } from '@angular/core';
//import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-chart-mapping',
  imports: [HighchartsChartModule],
  templateUrl: './chart-mapping.component.html',
  styleUrl: './chart-mapping.component.css'
})
export class ChartMappingComponent {
  }