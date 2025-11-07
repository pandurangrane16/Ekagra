import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, SimpleChanges } from '@angular/core';
import { StatisticsChartComponent } from './widgets/statistics-chart/statistics-chart.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-tes',
  imports: [StatisticsChartComponent,MatButtonToggleModule, CommonModule],
  templateUrl: './dashboard-tes.component.html',
  styleUrl: './dashboard-tes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTESComponent {
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
violationsData = 
     [
        ['DOUBLEPARK', 30 ],
        [ 'FOOTPATHDRIVE', 40],
        ['FREELEFT', 25, ],
        ['MOBILEUSE', 50, ],
        ['NOHELMET', 30, ],
        ['NOPARK', 20, ],
        ['NOSEATBELT', 10, ],
        ['OVERSPEED', 10, ],
        ['RASHDRIVE', 30, ],
        ['REDLIGHT', 10, ],
        ['STOPLINE', 10, ],
        ['TRIPLERIDE', 5, ],
        ['WRONGDIRECTION', 3, ],
        ['WRONGLANE', 2, ],
    ];

revenueData = 
     [
        ['DOUBLEPARK', 50 ],
        [ 'FOOTPATHDRIVE', 40],
        ['FREELEFT', 25, ],
        ['MOBILEUSE', 50, ],
        ['NOHELMET', 30, ],
        ['NOPARK', 20, ],
        ['NOSEATBELT', 10, ],
        ['OVERSPEED', 10, ],
        ['RASHDRIVE', 30, ],
        ['REDLIGHT', 10, ],
        ['STOPLINE', 10, ],
        ['TRIPLERIDE', 5, ],
        ['WRONGDIRECTION', 3, ],
        ['WRONGLANE', 2, ],
    ];
    challanData = 
     [
        ['DOUBLEPARK', 130 ],
        [ 'FOOTPATHDRIVE', 40],
        ['FREELEFT', 25, ],
        ['MOBILEUSE', 50, ],
        ['NOHELMET', 30, ],
        ['NOPARK', 20, ],
        ['NOSEATBELT', 10, ],
        ['OVERSPEED', 10, ],
        ['RASHDRIVE', 30, ],
        ['REDLIGHT', 10, ],
        ['STOPLINE', 10, ],
        ['TRIPLERIDE', 5, ],
        ['WRONGDIRECTION', 3, ],
        ['WRONGLANE', 2, ],
    ];
    siteWiseVoilationData = 
     [
            ['Site 1', 100],
            ['Site 2', 75],
            ['Site 3', 70],
            ['Site 4', 85],
            ['Site 5', 91],
            ['Site 6', 74],
            ['Site 7', 52],
            ['Site 8', 89],
            ['Site 9', 67],
            ['Site 10', 81]
        
        ];
    lprData = 
     [
            ['Accurate', 100],
            ['Nonstandard', 75],
            ['Unclean', 70],
            ['Inaccurate', 85]
           
        ];
  chart: any;

constructor(private renderer: Renderer2) {}
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


