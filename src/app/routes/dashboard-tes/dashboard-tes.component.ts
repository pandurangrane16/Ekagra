import { ChangeDetectionStrategy, Component, ElementRef, inject, Renderer2, SimpleChanges ,OnInit} from '@angular/core';
import { StatisticsChartComponent } from './widgets/statistics-chart/statistics-chart.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { TesDashboardService } from '../../services/tes-dashboard.service';
import { HttpService } from '../../services/common/http.service';
import { withLoader } from '../../services/common/common';
import { LoaderService } from '../../services/common/loader.service';
import { response } from 'express';
import{ChangeDetectorRef} from '@angular/core';
@Component({
  selector: 'app-dashboard-tes',
  imports: [StatisticsChartComponent,MatButtonToggleModule, CommonModule ],
  templateUrl: './dashboard-tes.component.html',
  styleUrl: './dashboard-tes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DashboardTESComponent implements OnInit{
  TodaysTotalVoilation:any;
  TodaysTotalRevenue:any;
  TodaysProcessedChallan:any;
loaderService = inject(LoaderService);
filterValue: string = 'week'; // default


 


  expandedIndex: string | null = null;
  private activeCard: HTMLElement | null = null;
  isCardExpanded = false;
  chartHeight = 180;
  chartHeight2 = 220;
violationsDataColors = [
            '#ff6347', '#4682b4', '#32cd32', '#ffd700', '#ff98f6ff', '#004f4f',
            '#ff1493', '#8a2be2', '#20b2aa', '#dc143c','#999966','#00006e','#ff8c00','#ff6347'
        ];
siteWiseVoilationDataColors = [
            '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
            '#6225ed', '#5b30e7', '#533be1', '#4c46db'
        ];
lprDataColors = [
            '#32cd32', '#ff8c00', '#004f4f', '#dc143c'
        ];

violationsData: any[] = [];
revenueData: any[] = [];
challanData: any[] = [];  
siteWiseVoilationData: any[] = [];
// violationsData = 
//      [
//         ['DOUBLEPARK', 30 ],
//         [ 'FOOTPATHDRIVE', 40],
//         ['FREELEFT', 25, ],
//         ['MOBILEUSE', 50, ],
//         ['NOHELMET', 30, ],
//         ['NOPARK', 20, ],
//         ['NOSEATBELT', 10, ],
//         ['OVERSPEED', 10, ],
//         ['RASHDRIVE', 30, ],
//         ['REDLIGHT', 10, ],
//         ['STOPLINE', 10, ],
//         ['TRIPLERIDE', 5, ],
//         ['WRONGDIRECTION', 3, ],
//         ['WRONGLANE', 2, ],
//     ];


// revenueData = 
//      [
//         ['DOUBLEPARK', 50 ],
//         [ 'FOOTPATHDRIVE', 40],
//         ['FREELEFT', 25, ],
//         ['MOBILEUSE', 50, ],
//         ['NOHELMET', 30, ],
//         ['NOPARK', 20, ],
//         ['NOSEATBELT', 10, ],
//         ['OVERSPEED', 10, ],
//         ['RASHDRIVE', 30, ],
//         ['REDLIGHT', 10, ],
//         ['STOPLINE', 10, ],
//         ['TRIPLERIDE', 5, ],
//         ['WRONGDIRECTION', 3, ],
//         ['WRONGLANE', 2, ],
//     ];
    // challanData = 
    //  [
    //     ['DOUBLEPARK', 130 ],
    //     [ 'FOOTPATHDRIVE', 40],
    //     ['FREELEFT', 25, ],
    //     ['MOBILEUSE', 50, ],
    //     ['NOHELMET', 30, ],
    //     ['NOPARK', 20, ],
    //     ['NOSEATBELT', 10, ],
    //     ['OVERSPEED', 10, ],
    //     ['RASHDRIVE', 30, ],
    //     ['REDLIGHT', 10, ],
    //     ['STOPLINE', 10, ],
    //     ['TRIPLERIDE', 5, ],
    //     ['WRONGDIRECTION', 3, ],
    //     ['WRONGLANE', 2, ],
    // ];
    // siteWiseVoilationData = 
    //  [
    //         ['Site 1', 100],
    //         ['Site 2', 75],
    //         ['Site 3', 70],
    //         ['Site 4', 85],
    //         ['Site 5', 91],
    //         ['Site 6', 74],
    //         ['Site 7', 52],
    //         ['Site 8', 89],
    //         ['Site 9', 67],
    //         ['Site 10', 81]
        
    //     ];
    lprData = 
     [
            ['Accurate', 100],
            ['Nonstandard', 75],
            ['Unclean', 70],
            ['Inaccurate', 85]
           
        ];
  chart: any;

constructor(
  private renderer: Renderer2,
  private service:TesDashboardService,
  private cdr: ChangeDetectorRef
) {}
  ngOnInit(): void {
    
      this.fetchTodaysTotalVoilation();
      this.fetchVoilationData();

      this.fetchTodaysTotalRevenue(); 
      this.fetchTotalRevenue();

      this.fetchTodaysProcessedChallan(); 
      this.fetchTotalProcessedChallan();

      this.fetchSiteWiseVoilationData();
  }

  onFilterChange(value: string): void {
  this.filterValue = value;

      this.fetchTodaysTotalVoilation();
      this.fetchVoilationData();

      this.fetchTodaysTotalRevenue(); 
      this.fetchTotalRevenue();

       this.fetchSiteWiseVoilationData();
}

 fetchTodaysTotalVoilation() {
  debugger;
      const requestBody = {
    projectId: 44,
    type: 1,
    inputs: "day",
    bodyInputs: "",
    seq: 9
  };
  this.service.GetSiteResponse(requestBody)
    .pipe(withLoader(this.loaderService))  
    .subscribe({
      next: (res: any) => {

        let totalViolations = 0;

// API response stored in `response`
const parsedResult = JSON.parse(res.result);

// Access data array
const violations = parsedResult.data;

// Calculate total violations
totalViolations = violations.reduce(
  (sum: number, item: any) => sum + (item.violationCount || 0),
  0
);

console.log('Total Violations:', totalViolations);

        this.TodaysTotalVoilation = totalViolations;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
      }
    });
}
fetchVoilationData(): void {
  const requestBody = {
    projectId: 44,
    type: 1,
    inputs: this.filterValue,
    bodyInputs: '',
    seq: 9
  };

  this.service.GetSiteResponse(requestBody)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (res: any) => {

        const parsedResult = JSON.parse(res.result);
        const data = parsedResult.data || [];

        // 🔥 Convert API response to chart format
        // [ ['NOHELMET', 45733], ['REDLIGHT', 17], ... ]
        this.violationsData = data.map((item: any) => [
          item.violationType,
          item.violationCount || 0
        ]);

        // 🔥 Required for OnPush
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
      }
    });
}


fetchTodaysTotalRevenue() {

  debugger;
      const requestBody = {
    projectId: 44,
    type: 1,
    inputs: "day",
    bodyInputs: "",
    seq: 8
  };
  this.service.GetSiteResponse(requestBody)
    .pipe(withLoader(this.loaderService))  
    .subscribe({
      next: (res: any) => {

        let TodaysTotalRevenue = 0;

// API response stored in `response`
const parsedResult = JSON.parse(res.result);

// Access data array
const Revenues = parsedResult.data;

// Calculate total violations
TodaysTotalRevenue = Revenues.reduce(
  (sum: number, item: any) => sum + (item.violationPenaltyAmount || 0),
  0
);

console.log('Total Violations:', TodaysTotalRevenue);

        this.TodaysTotalRevenue = TodaysTotalRevenue;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
      }
    });
}
fetchTotalRevenue(): void {
  const requestBody = {
    projectId: 44,
    type: 1,
    inputs: this.filterValue,
    bodyInputs: '',
    seq: 8
  };

  this.service.GetSiteResponse(requestBody)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (res: any) => {

        const parsedResult = JSON.parse(res.result);
        const data = parsedResult.data || [];

        // 🔥 Convert API response to chart format
        // [ ['NOHELMET', 45733], ['REDLIGHT', 17], ... ]
        this.revenueData = data.map((item: any) => [
          item.violationType,
          item.violationPenaltyAmount || 0
        ]);

        // 🔥 Required for OnPush
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
      }
    });
}


fetchTodaysProcessedChallan() {

  debugger;
      const requestBody = {
    projectId: 44,
    type: 1,
    inputs: "day",
    bodyInputs: "",
    seq: 6
  };
  this.service.GetSiteResponse(requestBody)
    .pipe(withLoader(this.loaderService))  
    .subscribe({
      next: (res: any) => {

        let TodaysProcessedChallan = 0;

// API response stored in `response`
const parsedResult = JSON.parse(res.result);

// Access data array
const ProcessedChallan = parsedResult.data;

// Calculate total violations
TodaysProcessedChallan = ProcessedChallan.reduce(
  (sum: number, item: any) => sum + (item.violationCount || 0),
  0
);

console.log('Total TodaysProcessedChallan:', TodaysProcessedChallan);

        this.TodaysProcessedChallan = TodaysProcessedChallan;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
      }
    });
}
fetchTotalProcessedChallan(): void {
  const requestBody = {
    projectId: 44,
    type: 1,
    inputs: this.filterValue,
    bodyInputs: '',
    seq: 6
  };

  this.service.GetSiteResponse(requestBody)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (res: any) => {

        const parsedResult = JSON.parse(res.result);
        const data = parsedResult.data || [];

        // 🔥 Convert API response to chart format
        // [ ['NOHELMET', 45733], ['REDLIGHT', 17], ... ]
        this.challanData = data.map((item: any) => [
          item.violationType,
          item.violationCount || 0
        ]);

        // 🔥 Required for OnPush
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
      }
    });
}


fetchSiteWiseVoilationData(): void {
  const requestBody = {
    projectId: 44,
    type: 1,
    inputs: this.filterValue,   // day / week / month
    bodyInputs: '',
    seq: 10                     // ⚠️ use correct seq for site-wise API
  };

  this.service.GetSiteResponse(requestBody)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (res: any) => {

        const parsedResult = JSON.parse(res.result);
        const siteStats = parsedResult?.data?.siteWiseStatistics || [];

        /*
          Convert response to chart format
          [
            ['TVM_SITE', 45817],
            ['SITE_2', 1234]
          ]
        */

        this.siteWiseVoilationData = siteStats.map((site: any) => {
          const totalViolations = Object.values(site.violations || {})
            .reduce((sum: number, count: any) => sum + (count as number), 0);

          return [site.siteName, totalViolations];
        });

        // 🔥 REQUIRED FOR OnPush
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
      }
    });
}

// If there is no site wise data then use below method with dummy data 
// fetchSiteWiseVoilationData(): void {

//   // 🔹 Dummy response (same structure as API)
//   const dummyResponse = {
//     data: {
//       uniqueViolationTypes: [
//         { violationType: 'NOHELMET', violationTypeId: 4 }
//       ],
//       siteWiseStatistics: [
//         {
//           siteId: 1,
//           siteName: 'TEST_SITE_001',
//           violations: { NOHELMET: 2918 }
//         },
//         {
//           siteId: 2,
//           siteName: 'TEST_SITE_002',
//           violations: { NOHELMET: 2918 }
//         },
//         {
//           siteId: 3,
//           siteName: 'TEST_SITE_003',
//           violations: { NOHELMET: 2918 }
//         }
//       ]
//     },
//     status: 'success'
//   };

//   const siteStats = dummyResponse.data.siteWiseStatistics;

//   // 🔥 Convert to chart format
//   this.siteWiseVoilationData = siteStats.map(site => {
//     const totalViolations = Object.values(site.violations || {})
//       .reduce((sum: number, val: any) => sum + val, 0);

//     return [site.siteName, totalViolations];
//   });

//   // Required because of OnPush
//   this.cdr.markForCheck();
// }



   expand(id: string, event: MouseEvent, cardRef: ElementRef<HTMLDivElement> | HTMLDivElement): void  {
    event.stopPropagation(); // prevent bubbling
    
     this.isCardExpanded = !this.isCardExpanded;
    // const target = (event.currentTarget as HTMLElement).closest('.card');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.classList.toggle('fullscreenDiv');
    const cardEl = cardRef instanceof ElementRef ? cardRef.nativeElement : cardRef;

     if (this.activeCard && this.activeCard !== cardEl) {
      this.renderer.removeClass(this.activeCard, 'fullscreen');
      this.expandedIndex = null;
    }
    const isAlreadyExpanded = this.expandedIndex === id;
    if (isAlreadyExpanded) {
      this.renderer.removeClass(cardEl, 'fullscreen');
      this.expandedIndex = null;
      this.activeCard = null;
    } else {
      this.renderer.addClass(cardEl, 'fullscreen');
       this.expandedIndex = id;
      this.activeCard = cardEl;
    }
  }

  }


