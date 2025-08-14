import { Component, inject } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import Highcharts from 'highcharts';
import { SessionService } from '../../services/common/session.service';
import { atcsDashboardservice } from '../../services/atcs/atcsdashboard.service';

@Component({
  selector: 'app-user-dash',
  imports: [HighchartsChartModule,MaterialModule,CommonModule],
  templateUrl: './user-dash.component.html',
  styleUrl: './user-dash.component.css'
})
export class UserDashComponent {
dashboardData:any;
Highcharts: typeof Highcharts = Highcharts;
alertsData: any[] = [];
service=inject(atcsDashboardservice);
  constructor(private session: SessionService) {}

  ngOnInit() {
    const saved = this.session._getSessionValue('DashboardForm');
    if (saved) {
      this.dashboardData = JSON.parse(saved);
      console.log(this.dashboardData);
    }
     this.fetchAlerts();
  }

   fetchAlerts(): void {
    const from = '2025-07-01 04:28:01.785';
    const to = '2025-07-23 04:28:01.786';
    const defaultImg = 'assets/img/icon_user.png';
    this.service.getAlerts(from, to).subscribe({
      next: (data:any) => {
        console.log("hi2", data);

        this.alertsData = data.result;
        this.alertsData = (data.result || []).map((alert: any) => ({
          ...alert,
          img: defaultImg
        }));

        console.log("hi3", this.alertsData);
      },
      error: (err:any) => {
        console.error('Error fetching alerts:', err);
      }
    });
  }
}
