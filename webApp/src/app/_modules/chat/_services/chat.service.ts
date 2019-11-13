import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from '../_models';

@Injectable()
export class ChatService {
  private api: string;

  constructor(private http: HttpClient) {
    this.api = '/chats';
  }

  getList(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.api);
  }
}
