import { Injectable } from '@angular/core';
import moment from 'moment';


export interface Section {
  name: string;
  updated: any;
  img:string;
  category:string;
}


@Injectable()
export class AlertsService {
  alerts: Section[] = [
      {
        name: 'Alert 1',
        updated: moment('2025.03.10').fromNow(),
        img:'assets/img/icon_user.png',
        category:'red'
      },
      {
        name: 'Alert 2',
        updated:   moment('2025.03.12').fromNow(),
         img:'assets/img/icon_user.png',
         category:'normal'
      },
      {
        name: 'Alert 3',
        updated:   moment('2025.03.17').fromNow(),
         img:'assets/img/icon_user.png',
         category:'normal'
      },
      {
        name: 'Alert 4',
        updated:   moment('2025.03.18').fromNow(),
         img:'assets/img/icon_user.png',
         category:'orange'
      },
      {
        name: 'Alert 5',
        updated:  moment({hour: 12, minute: 30}).fromNow(),
         img:'assets/img/icon_user.png',
         category:'normal'
      },
      {
        name: 'Alert 6',
        updated:  moment({hour: 12, minute: 30}).fromNow(),
         img:'assets/img/icon_user.png',
         category:'normal'
      },
    ];
 

  constructor() { }


  getData(): Section[] {
    return this.alerts;
  }


}
