import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: any;
  private proxy: any;

  public initializeSignalRConnection(): void {
    this.connection = $.hubConnection('http://localhost:yourPort/signalr');
    this.proxy = this.connection.createHubProxy('yourHubName');

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
