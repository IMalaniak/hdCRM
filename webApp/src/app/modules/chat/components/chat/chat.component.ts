import { Component, OnInit, Input, OnDestroy, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { User } from '@/modules/users';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { SocketEvent, SocketService } from '@/shared';
import { ChatService } from '../../services';
import { Chat, ChatMessage } from '../../models';
import { FormControl, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
  user: User;
  @Input() selectedChat: Chat;
  chat: Chat;
  messageContent: FormControl;

  constructor(private chatService: ChatService, private socketService: SocketService, private store$: Store<AppState>) {
    this.store$.pipe(select(currentUser)).subscribe(systemUser => {
      this.user = systemUser;
    });
  }

  ngOnInit(): void {
    this.messageContent = new FormControl('', [Validators.required]);

    this.chatService.onGM().subscribe((message: ChatMessage) => {
      this.chat.messages.push(message);
    });
  }

  ngOnChanges(): void {
    if (this.selectedChat) {
      this.chat = cloneDeep(this.selectedChat);
      this.socketService.emit(SocketEvent.JOIN, this.selectedChat);
    }
  }

  public sendMessage(): void {
    if (!this.messageContent.value || this.messageContent.value.length === 0) {
      return;
    }

    this.chatService.sendGM({
      sender: this.user,
      content: this.messageContent.value,
      room: this.selectedChat.room,
      createdAt: new Date()
    });
    this.messageContent.reset();
  }

  ngOnDestroy(): void {
    if (this.selectedChat) {
      this.socketService.emit(SocketEvent.LEAVE, this.selectedChat);
    }
  }
}
