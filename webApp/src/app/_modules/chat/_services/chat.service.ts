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

  getList(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.api);
  }

  public send(message: ChatMessage): void {
    this.scktService.emit(SocketEvent.CHATMESSAGE, message);
  }

  public onMessage(): Observable<ChatMessage> {
    return this.scktService.onEvent(SocketEvent.CHATMESSAGE);
  }
}
