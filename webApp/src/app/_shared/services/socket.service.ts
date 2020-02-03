import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { SocketEvent } from '../models/socketEvent';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: socketIo.Socket;

  constructor() {
    
  }

  public initSocket(): void {
    this.socket = socketIo(environment.baseUrl);
  }

  public emit(event: SocketEvent, params?: any): void {
    return this.socket.emit(event, params);
  }

  public onEvent(event: SocketEvent): Observable<any> {
    return new Observable<SocketEvent>(observer => {
      this.socket.on(event, (params) => observer.next(params));
    });
  }
}
