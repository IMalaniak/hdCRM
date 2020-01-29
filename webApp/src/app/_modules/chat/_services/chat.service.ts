import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat, ChatMessage } from '../_models';
import { SocketEvent } from '@/_shared/models/socketEvent';
import { SocketService } from '@/_shared/services/socket.service';

@Injectable()
export class ChatService {
  private api: string;

  constructor(private http: HttpClient, private scktService: SocketService) {
    this.api = '/chats';
  }

  getGroupChatList(): void {
    return this.scktService.emit(SocketEvent.GETGROUPCHATLIST);
  }

  public sendPM(message: ChatMessage): void {
    this.scktService.emit(SocketEvent.PRIVATEMESSAGE, message);
  }

  public sendGM(message: ChatMessage): void {
    this.scktService.emit(SocketEvent.GROUPMESSAGE, message);
  }

  public onPM(): Observable<ChatMessage> {
    return this.scktService.onEvent(SocketEvent.PRIVATEMESSAGE);
  }

  public onGM(): Observable<ChatMessage> {
    return this.scktService.onEvent(SocketEvent.GROUPMESSAGE);
  }
}
