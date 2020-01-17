import { Component, OnInit } from '@angular/core';
import { User } from '@/_modules/users/_models/user';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { SocketService } from '@/_shared/services/socket.service';
import { SocketEvent } from '@/_shared/models/socketEvent';
import { ChatService } from '../../_services';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  user: User;
  messages: any[] = [];
  messageContent: string;

  constructor(private chatService: ChatService, private socketService: SocketService, private store$: Store<AppState>) {
    this.store$.pipe(select(currentUser)).subscribe(systemUser => {
      this.user = systemUser;
    });
  }

  ngOnInit(): void {
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.chatService.onMessage().subscribe((message: any) => {
      console.log(message);
      this.messages.push(message);
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    // this.chatService.send({
    //   sender: this.user,
    //   content: message
    //   room: 'RoomTest'
    // });
    this.messageContent = null;
  }

}
