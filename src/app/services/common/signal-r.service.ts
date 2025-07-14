import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: any;
  private proxy: any;

  public initializeSignalRConnection(): void {
    this.connection = (window as any).jQuery.hubConnection('https://172.19.32.51:4444/signalr/signalr/hubs');
    this.proxy = this.connection.createHubProxy('signalRHub');

    this.proxy.on('messageReceived', (message:any) => {
      console.log('Message from server:', message);
    });

    this.connection.start()
      .done(() => console.log('Connected to SignalR hub'))
      .fail((error:any) => console.error('SignalR connection error:', error));
  }

  public sendMessage(msg: string): void {
    this.proxy.invoke('SendMessage', msg);
  }
}
