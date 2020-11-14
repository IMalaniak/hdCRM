import { Injectable } from '@angular/core';
import { Manager, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

import { SocketEvent } from '../constants';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private manager = new Manager(environment.baseUrl, {
    transports: ['websocket']
  });
  private socket: Socket;
  constructor() {
    this.socket = this.manager.socket('/');
  }

  // TODO type declaration?
  public emit(event: SocketEvent, params?: any) {
    return this.socket.emit(event, params);
  }

  public onEvent(event: SocketEvent): Observable<any> {
    return new Observable<SocketEvent>((observer) => {
      this.socket.on(event, (params) => observer.next(params));
    });
  }
}
