import { Component, computed, signal } from '@angular/core';
import { MapviewComponent } from "../dashboard/widgets/mapview/mapview.component";
import { NotificationComponent } from '../dashboard/widgets/notification/notification.component';
import { WeeklyOverviewComponent } from "./widgets/weekly-overview/weekly-overview.component";
import { DeviceHealthComponent } from "./widgets/device-health/device-health.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-surveilience-page',
    imports: [MapviewComponent, NotificationComponent, WeeklyOverviewComponent, DeviceHealthComponent, MatButtonModule, MatIconModule, RouterModule],
    templateUrl: './surveilience-page.component.html',
    styleUrl: './surveilience-page.component.css'
})

export class SurveiliencePageComponent {
 


}
