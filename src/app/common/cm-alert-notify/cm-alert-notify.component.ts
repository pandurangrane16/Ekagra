import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/common/alert.service';
import { Alert } from '../../utils/alert.model';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-cm-alert-notify',
  imports: [CommonModule],
  templateUrl: './cm-alert-notify.component.html',
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
    if (alert.bgColor || alert.textColor) {
      return {
        background: alert.bgColor ?? '#333',
        color: alert.textColor ?? '#fff'
      };
    }

    // default colors by type
    return {
      success: { background: '#16a34a', color: '#fff' },
      error: { background: '#dc2626', color: '#fff' },
      warning: { background: '#f59e0b', color: '#000' },
      info: { background: '#2563eb', color: '#fff' },
      vms: { background: '#780bf5ff', color: '#000' },
    parking: { background: '#a51d5dff', color: '#000' },
     pa: { background: '#431a04ff', color: '#000' },
    atcs: { background: '#645f56ff', color: '#000' },
    }[alert.type];
  }

  close(id: number) {
    this.alertService.remove(id);
  }
}
