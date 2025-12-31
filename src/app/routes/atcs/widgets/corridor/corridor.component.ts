import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { atcsDashboardservice } from '../../../../services/atcs/atcsdashboard.service';

@Component({
  selector: 'app-corridor',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule],
  templateUrl: './corridor.component.html',
  styleUrls: ['./corridor.component.css']
})
export class CorridorComponent implements OnInit, OnChanges {

  @Input() siteId: number = 0;
  @Input() fromDate: any;
  @Input() toDate: any;
  @Input() corridorData: any[] = [];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options | null = null;

  constructor(private atcsService: atcsDashboardservice) {}

  ngOnInit(): void {
    if (!this.siteId) {
      const sessionSiteId = sessionStorage.getItem('siteId');
      this.siteId = sessionSiteId ? Number(sessionSiteId) : 0;
    }

    // this.loadCorridorData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['corridorData']) {
      this.prepareChart();
    }
  }

  private formatDate(value: any): string {
    const d = new Date(value);
    return d.toISOString().split('T')[0];
  }

  /** Load data from API */
  // loadCorridorData(): void {
  //   const today = this.formatDate(new Date());

  //   const from = this.fromDate ? this.formatDate(this.fromDate) : today;
  //   const to = this.toDate ? this.formatDate(this.toDate) : today;

  //   this.atcsService.getCongestionData(this.siteId, from, to).subscribe({
  //     next: (res: any) => {
  //       this.corridorData = res?.result || [];
  //       this.prepareChart();
  //     },
  //     error: err => console.error("Corridor API failed:", err)
  //   });
  // }

//   /** Build Highcharts Column Graph */
//   prepareChart(): void {

//     if (!this.corridorData || this.corridorData.length === 0) {
//       this.chartOptions = null;
//       return;
//     }

//     const categories = this.corridorData.map(x => x.RTC);

//     const seriesData = this.corridorData.map((x: any) => ({
//       y: x.saturation === 'NA' ? 0 : Number(x.saturation),
//       junctionName: x.junctionName,
//       junctionStatus: x.junctionStatus,
//       category: x.RTC
//     }));

//     this.chartOptions = {
//       chart: {
//         type: 'column'
//       },

//       title: {
//         text: 'Corridor Saturation Report'
//       },

//       xAxis: {
//         categories,
//         title: { text: 'RTC' },
//         labels: { rotation: -45 }
//       },

//       yAxis: {
//         min: 0,
//         title: { text: 'Saturation' }
//       },

//     tooltip: {
//   useHTML: true,
//   formatter: function (this: any) {
//     const p: any = this;  // force bypass TS typing

//     return `
//       <b>RTC:</b> ${p.category}<br>
//       <b>Saturation:</b> ${p.y}<br>
//       <b>Junction:</b> ${p.junctionName}<br>
//       <b>Status:</b> ${p.junctionStatus}
//     `;
//   }
// },

//       credits: { enabled: false },

//       series: [{
//         type: 'column',
//         name: 'Saturation',
//         data: seriesData
//       }] as Highcharts.SeriesColumnOptions[]
//     };
//   }


prepareChart(): void {
  console.log("Corridor Data:", this.corridorData);

  if (!this.corridorData || this.corridorData.length === 0) {
    this.chartOptions = null;
    return;
  }

  // const categories = this.corridorData.map(x => x.RTC);
  const categories = this.corridorData.map((_, index) => index.toString());

  const seriesData = this.corridorData.map((x: any) => ({
    y: x.saturation === 'NA' ? 0 : Number(x.saturation),
    junctionName: x.junctionName,
    junctionStatus: x.junctionStatus,
    rtc: x.RTC
  }));

  // this.chartOptions = {
  //   chart: {
  //     type: 'line',
  //     zoomType: 'x'
  //   },

  //   title: {
  //     text: 'Corridor Saturation Report'
  //   },

  //   xAxis: {
  //     categories,
  //     title: { text: 'RTC' },
  //     labels: { rotation: -45 }
  //   },

  //   yAxis: {
  //     min: 0,
  //     title: { text: 'Saturation' }
  //   },

  //   tooltip: {
  //     useHTML: true,
  //     formatter: function (this: any) {
  //       const p: any = this;
  //       return `
  //         <b>RTC:</b> ${p.category}<br>
  //         <b>Saturation:</b> ${p.y}<br>
  //         <b>Junction:</b> ${p.junctionName}<br>
  //         <b>Status:</b> ${p.junctionStatus}
  //       `;
  //     }
  //   },

  //   credits: { enabled: false },

  //   plotOptions: {
  //     line: {
  //       marker: {
  //         enabled: false,     // smoother line for hourly data
  //         radius: 2
  //       }
  //     }
  //   },

  //   series: [{
  //     type: 'line',
  //     name: 'Saturation',
  //     data: seriesData
  //   }] as Highcharts.SeriesLineOptions[]
  // };

  this.chartOptions = {
  chart: {
    type: 'line',
    zoomType: 'x',
  } as Highcharts.ChartOptions,

  title: {
    text: 'Corridor Saturation Report'
  },
  legend: {
      enabled: false
    },

  xAxis: {
    categories,
    title: { text: 'RTC' },
    labels: { rotation: 0 }
  },

  yAxis: {
    min: 0,
    title: { text: 'Saturation' }
  },

  tooltip: {
    useHTML: true,
    formatter: function (this: any) {
      const p: any = this;
      return `
        <b>RTC:</b> ${p.rtc}<br>
        <b>Saturation:</b> ${p.y}<br>
       
        <b>Status:</b> ${p.junctionStatus}
      `;


  
    }
  },

  credits: { enabled: false },

  plotOptions: {
    line: {
      marker: { enabled: false, radius: 2 }
    }
  },

  series: [{
    type: 'line',
    name: 'Saturation',
    data: seriesData
  }] as Highcharts.SeriesLineOptions[]
};


}
  /** Date Filters */
  // onFromDateChange(event: any) {
  //   this.fromDate = event.target.value;
  //   this.loadCorridorData();
  // }

  // onToDateChange(event: any) {
  //   this.toDate = event.target.value;
  //   this.loadCorridorData();
  // }
}
