import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { AlertsService } from '../../../../services/alerts.service';
// export interface Section {
//   name: string;
//   updated: any;
//   img:string;
// }


@Component({
    selector: 'app-notification',
    imports: [MatListModule, MatIconModule],
    providers: [AlertsService],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css'
})



export class NotificationComponent  implements OnInit {

  alertsData: any[] = [];
  constructor(private alertsService: AlertsService) {}
  ngOnInit(): void {
    this.alertsData = this.alertsService.getData();

    console.log(this.alertsData);

    }
//   alerts: Section[] = [
//     {
//       name: 'Alert 1',
//       updated: moment('2025.03.10').fromNow(),
//       img:'assets/img/icon_user.png'
//     },
//     {
//       name: 'Alert 2',
//       updated:   moment('2025.03.12').fromNow(),
//        img:'assets/img/icon_user.png'
//     },
//     {
//       name: 'Alert 3',
//       updated:   moment('2025.03.17').fromNow(),
//        img:'assets/img/icon_user.png'
//     },
//     {
//       name: 'Alert 4',
//       updated:   moment('2025.03.18').fromNow(),
//        img:'assets/img/icon_user.png'
//     },
//     {
//       name: 'Alert 5',
//       updated:  moment({hour: 12, minute: 30}).fromNow(),
//        img:'assets/img/icon_user.png'
//     },
//   ];
 }
