import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../../../../services/alerts.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-alert',
  standalone: true,
  imports: [MatButtonModule],
  providers:[AlertsService],
  templateUrl: './new-alert.component.html',
  styleUrl: './new-alert.component.css'
})
export class NewAlertComponent  implements OnInit {
  alertsData: any[] = [];
  newAlert:any;
  constructor(private alertsService: AlertsService) {}
  ngOnInit(): void {
    this.alertsData = this.alertsService.getData();

    console.log(this.alertsData.length-1);
    this.newAlert = this.alertsData[this.alertsData.length-1];

    }

}
