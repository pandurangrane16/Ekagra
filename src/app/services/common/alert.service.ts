import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Alert {
  id?: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  bgColor?: string;
  textColor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private ws!: WebSocket;
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  alerts$ = this.alertsSubject.asObservable();
  private idCounter = 0;

  constructor(private ngZone: NgZone) {}

  connect(): void {
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onopen = () => console.log('✅ WS Connected');
    this.ws.onclose = () => console.log('❌ WS Disconnected');
    this.ws.onerror = err => console.error('WS Error', err);

    this.ws.onmessage = (event) => {
      this.ngZone.run(() => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === 'alert') {
            this.show(payload.data);
          }
        } catch (err) {
          console.error('Invalid WS message', err);
        }
      });
    };
  }

  show(alert: Alert) {
    alert.id = ++this.idCounter;
    const current = this.alertsSubject.value;
    this.alertsSubject.next([...current, alert]);

    if (alert.duration) {
      setTimeout(() => this.remove(alert.id!), alert.duration);
    }
  }

  remove(id: number) {
    this.alertsSubject.next(this.alertsSubject.value.filter(a => a.id !== id));
  }

  sendAlert(alert: Alert) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(alert));
    }
  }
}
