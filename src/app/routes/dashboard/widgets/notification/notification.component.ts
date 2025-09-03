import { Component,Input,OnChanges, inject, SimpleChanges,OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { AlertsService } from '../../../../services/alerts.service';
import { atcsDashboardservice } from '../../../../services/atcs/atcsdashboard.service';
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



export class NotificationComponent  implements OnInit,OnChanges {

  alertsData: any[] = [];


    @Input() fromDate!: Date | null;
  @Input() toDate!: Date | null;
  
  constructor(private alertsService: AlertsService,private service:atcsDashboardservice) {}
  ngOnInit(): void {
    // this.alertsData = this.alertsService.getData();
     //console.log("hi4",this.alertsData);
    this.fetchAlerts();
    //console.log("hi",this.alertsData);

    }

      ngOnChanges(changes: SimpleChanges): void {
    // This will fire whenever parent updates fromDate or toDate
    if ((changes['fromDate'] || changes['toDate']) && this.fromDate && this.toDate) {
      this.fetchAlerts();
    }
  }

  fetchAlerts(): void {

  // const from = '2025-07-01 04:28:01.785';
  // const to = '2025-07-23 04:28:01.786';

      const from = this.fromDate ? this.fromDate.toISOString() : '';
    const to   = this.toDate ? this.toDate.toISOString() : '';
    const defaultImg = 'assets/img/icon_user.png';
    this.service.getAlerts(from,to).subscribe({
      next: (data) => {
          console.log("hi2",data);

        this.alertsData = data.result;
        this.alertsData = (data.result || []).map((alert:any)=> ({
        ...alert,
        img: defaultImg
      }));
        
         console.log("hi3",this.alertsData);
      },
      error: (err) => {
        console.error('Error fetching alerts:', err);
      }
    });
  }

showAlertDetails(alertData: any) {
  alert(JSON.stringify(alertData, null, 2)); 
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
