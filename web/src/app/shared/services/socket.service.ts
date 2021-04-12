import { Injectable } from '@angular/core';
import { Manager, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

import { SOCKET_EVENT } from '../constants';

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
  public emit(event: SOCKET_EVENT, params?: any) {
    return this.socket.emit(event, params);
  }

  public onEvent(event: SOCKET_EVENT): Observable<any> {
    return new Observable<SOCKET_EVENT>((observer) => {
      this.socket.on(event, (params) => observer.next(params));
    });
  }
}
