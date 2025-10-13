// signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private notificationSubject = new Subject<string>();
  public notifications$ = this.notificationSubject.asObservable();

  constructor() {
    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://172.19.32.220:8085/notificationHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR connection error: ', err));

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      console.log('📨 Notification received:', message);
      this.notificationSubject.next(message);
    });
  }
}
