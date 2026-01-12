import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/common/alert.service';
import { Alert } from '../../utils/alert.model';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cm-alert-notify',
  imports: [CommonModule,MatIconModule],
  templateUrl: './cm-alert-notify.component.html',
  styleUrls: ['./cm-alert-notify.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class CmAlertNotifyComponent implements OnInit {
  alerts$ = this.alertService.alerts$;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    // No extra code needed; alerts$ is already an Observable
  }

  styles(alert: Alert) {
    if (alert.bgColor || alert.textColor ) {
      return {
        background: alert.bgColor ?? '#333',
        color: alert.textColor ?? '#fff',
      };
    }

    // default colors by type
    return {
      success: { background: '#16a34a', color: '#fff' , borderColor:'#780bf5ff'},
      error: { background: '#dc2626', color: '#fff' , borderColor:'#780bf5ff'},
      warning: { background: '#f59e0b', color: '#000' , borderColor:'#780bf5ff'},
      info: { background: '#2563eb', color: '#fff', borderColor:'#780bf5ff' },
      vms: { background: '#66ccff', borderColor:'#088ed1'},
    parking: { background: '#a51d5dff', color: '#000', borderColor:'#780bf5ff' },
     pa: { background: '#431a04ff', color: '#000', borderColor:'#780bf5ff' },
    atcs: { background: '#645f56ff', color: '#000', borderColor:'#780bf5ff' },
    }[alert.type];
  }

// Dynamic class for main alert container
alertClass(alert: Alert) {
  return {
    'alert-vms': alert.type === 'vms',
    'alert-pa': alert.type === 'pa',
    'alert-atcs': alert.type === 'atcs',
    'alert-parking': alert.type === 'parking',
  };
}


  close(id: number) {
    this.alertService.remove(id);
  }
}
