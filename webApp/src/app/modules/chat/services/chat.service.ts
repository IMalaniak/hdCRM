import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models';
import { SocketService, SocketEvent } from '@/shared';
import { take } from 'rxjs/operators';

@Injectable()
export class ChatService {
  private api: string;
  groupChatListed$: Observable<any>;

  constructor(private http: HttpClient, private socket: SocketService) {
    this.api = '/chats';
    this.groupChatListed$ = this.socket.onEvent(SocketEvent.GROUPCHATLIST).pipe(
      take(1),
    );
  }

  getGroupChatList(): void {
    return this.socket.emit(SocketEvent.GETGROUPCHATLIST);
  }

  public sendPM(message: ChatMessage): void {
    this.socket.emit(SocketEvent.PRIVATEMESSAGE, message);
  }

  public sendGM(message: ChatMessage): void {
    this.socket.emit(SocketEvent.GROUPMESSAGE, message);
  }

  public onPM(): Observable<ChatMessage> {
    return this.socket.onEvent(SocketEvent.PRIVATEMESSAGE);
  }

  public onGM(): Observable<ChatMessage> {
    return this.socket.onEvent(SocketEvent.GROUPMESSAGE);
  }
}
