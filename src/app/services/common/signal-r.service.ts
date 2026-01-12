import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AlertService } from './alert.service';
import { Alert } from '../../utils/alert.model';

@Injectable({ providedIn: 'root' })
export class SignalRService {

  private hubConnection!: signalR.HubConnection;
  private isConnected = false;

  constructor(private alertService: AlertService) {}

  startConnection() {
    if (this.isConnected) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:3000/connection', {
        skipNegotiation: true, // 🔥 VERY IMPORTANT
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
        console.log('SignalR connected');
      })
      .catch(err => console.error('SignalR error:', err));

    this.hubConnection.on('ReceiveAlert', (alert: Alert) => {
      //this.alertService.show(alert);
    });
  }
}
