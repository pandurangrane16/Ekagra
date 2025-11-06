import { ChangeDetectionStrategy, Component } from '@angular/core';
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
    isCardExpanded = false;




    expand(): void {
    this.isCardExpanded = !this.isCardExpanded;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.classList.toggle('fullscreenDiv');
  }
}
