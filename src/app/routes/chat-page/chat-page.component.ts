import { Component, VERSION, AfterViewChecked, ElementRef, ViewChild, OnInit } from "@angular/core";
import {STATUSES, Message, User} from './models'
import {USERS, RANDOM_MSGS, getRandom} from './data'
import { CommonModule } from "@angular/common";
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-chat-page',
    imports: [CommonModule, MatIconModule],
    templateUrl: './chat-page.component.html',
    styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit, AfterViewChecked {

  statuses = STATUSES;
  activeUser:any;
  users = USERS;
  expandStatuses = false;
  expanded = false;
  messageReceivedFrom = {
    img: 'https://cdn.livechat-files.com/api/file/lc/img/12385611/371bd45053f1a25d780d4908bde6b6ef',
    name: 'Media bot'
  }

    @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

    ngOnInit() { 
      this.setUserActive(USERS[0])
        this.scrollToBottom();
    }
        ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

  addNewMessage(inputField: { value: string; }) {
    const val = inputField.value?.trim()
    if (val.length) {
      this.activeUser.messages.push({type: 'sent', message: val})
      this.activeUser.ws.send(
        JSON.stringify({id: this.activeUser.id, message: val})
        );
    }
    inputField.value = '';
  }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }

    setUserActive(user: User) {
      this.activeUser = user;
      this.connectToWS();
    }

    connectToWS() {
      if (this.activeUser.ws && this.activeUser.ws.readyState !== 1) {
        this.activeUser.ws = null;
        this.activeUser.status = STATUSES.OFFLINE;
      }
      if (this.activeUser.ws) {
        return;
      }
      const ws = new WebSocket('wss://compute.hotelway.ai:4443/?token=TESTTOKEN');
      this.activeUser.ws = ws;
      ws.onopen = (event) => this.onWSEvent(event, STATUSES.ONLINE);
      ws.onclose = (event) => this.onWSEvent(event, STATUSES.OFFLINE);
      ws.onerror = (event) => this.onWSEvent(event, STATUSES.OFFLINE);
      ws.onmessage = (result: any) => {
        const data = JSON.parse(result?.data || {});
        const userFound = this.users.find(u => u.id === data.id);
        if (userFound) {
          userFound.messages.push(
             new Message('replies', data.message)
          )
        }
      };
    }

    onWSEvent(event: Event, status: STATUSES) {
      this.users.forEach(u => u.ws === event.target ? u.status = status : null)
    }
}
function heartbeat(this: any) {
  clearTimeout(this.pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 1000);
}
