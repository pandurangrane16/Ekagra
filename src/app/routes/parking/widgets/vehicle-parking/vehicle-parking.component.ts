import { OnInit, Component,inject, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { withLoader } from '../../../../services/common/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { SessionService } from '../../../../services/common/session.service';
import { vmsdashboardService } from '../../../../services/dashboard/vmsDashboard.service';
interface VehicleChartPoint {
  name: string;
  y: number;
  color: string;
  custom: {
    img: string;
  };
}
@Component({
    selector: 'app-vehicle-parking',
    imports: [HighchartsChartModule, CommonModule],
    templateUrl: './vehicle-parking.component.html',
    styleUrl: './vehicle-parking.component.css'
})
export class VehicleParkingComponent implements OnInit {
  @ViewChild('customLegend')
  loaderService = inject(LoaderService);
  customLegend!: ElementRef;
  constructor(private renderer: Renderer2, private el: ElementRef,private service:vmsdashboardService,private session: SessionService ) {}
  public element: any;
  isChartReady = false;
  vehicleMetaMap: any = {
  'Two Wheeler': {
    color: '#5DBAE8',
    img: '/assets/img/LMV.png'
  },
  'Four Wheeler': {
    color: '#FFB2B2',
    img: '/assets/img/car.png'
  }
};

jsonData: { data: VehicleChartPoint[] } = {
  data: []
};

//   jsonData = {
//     "data": [
//       { name: 'LMV', y: 320, color: '#5DBAE8', custom: { img: '/assets/img/LMV.png' } },
//       { name: 'HMV', y: 50, color: '#FFB2B2', custom: { img: '/assets/img/HMV.png' } },
//       { name: 'Private Bus', y: 100, color: '#FF9933', custom: { img: '/assets/img/bus.png' } },
//       { name: 'Car', y: 100, color: '#192970', custom: { img: '/assets/img/car.png' } }
//     ]
// };
Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',  // Transparent background
      spacingLeft:0,
      spacingRight:0,
      spacingTop:0,
      spacingBottom:0
              
    },
    title: {
      text: '',
      align: 'left'
  },
tooltip: {
  useHTML: true,
  formatter: function () {
    const ctx = this as any;      // 👈 Highcharts formatter context
    const point = ctx.point;

    return `
      <b>${point.name}</b><br/>
      Count: <b>${point.y}</b><br/>
      Percentage: <b>${ctx.percentage.toFixed(1)}%</b>
    `;
  }
},
 
   legend: {
        enabled:false,
        layout: 'vertical',
        verticalAlign: 'bottom',
        align: 'left',
        labelFormatter: function() {
         
                  return `<span style="color:${this.color}">${this.name}: </span><br/>`;
             
      },
        // symbolHeight: 25,
        // symbolRadius: 5,
        itemMarginTop: 10,
        itemMarginBottom: 10,
      },
   
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: [{
          enabled: true,
          // format: '{point.percentage:.0f}%',
          connectorShape: 'none',
          useHTML: true,
          distance:-10,
          formatter: function () {
            const point = (this as any).point;
            const img = point.custom?.img ?? '';
            return `
              <div style="text-align: center;">
                <img src="${img}" style="width: 32px; height: 32px; margin-bottom: 4px;" />
               
              </div>
            `;
          },
          style: {
            fontSize: '0.9em',
            background:'red',
            borderRadius:50,
            color:'black'
        
      }
    }],
      showInLegend: true
  }
      
      
  },

  credits: {
    enabled: false
  },
  series: [{
    type: 'pie',
    innerSize: '70%',
    borderRadius: 0,
    data:this.jsonData.data,
}] as Highcharts.SeriesOptionsType[] // Casting to SeriesOptionsType[]
 ,
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

  ngOnInit(): void {
   this.loadVehicleCategoryChart();
  } 

  loadVehicleCategoryChart() {
  this.service
    .GetVehicleCategoryWiseCount(
      'CMS Office Bhandup',
      '2025-12-11',
      '2025-12-19'
    )
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (response: any) => {
        const breakdown = response?.result?.categoryBreakdown ?? [];
        this.prepareChartData(breakdown);
      }
    });
}
prepareChartData(breakdown: any[]) {

const chartData: VehicleChartPoint[] = breakdown.map(item => ({
  name: item.vehicleCategory,   // always string
  y: item.count,                // always number
  color: this.vehicleMetaMap[item.vehicleCategory]?.color ?? '#ccc',
  custom: {
    img: this.vehicleMetaMap[item.vehicleCategory]?.img ?? ''
  }
}));

  // ✅ Update pie series data ONLY
  (this.chartOptions.series as Highcharts.SeriesPieOptions[])[0].data =
    chartData;

  // ✅ Update custom legend
  this.jsonData.data = chartData;
    this.isChartReady = true;
}

  

}