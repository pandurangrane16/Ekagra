import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ListComponent } from './widgets/list/list.component';
import { AlertsService } from '../../services/alerts.service';
import { MatListModule } from '@angular/material/list';
import { SeverityComponent } from "./widgets/severity/severity.component";
import { OverviewComponent } from "./widgets/overview/overview.component";

@Component({
    selector: 'app-alerts-page',
    imports: [MatListModule, MatIconModule, ListComponent, MatButtonModule, SeverityComponent, OverviewComponent],
    providers: [AlertsService],
    templateUrl: './alerts-page.component.html',
    styleUrl: './alerts-page.component.css'
})
export class AlertsPageComponent implements OnInit {
  redAlert=false;
  orangeAlert=false;
  alertsData: any[] = [];
  constructor(private alertsService: AlertsService) {}
  ngOnInit(): void {
    this.alertsData = this.alertsService.getData();

    }
  }
