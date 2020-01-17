import socketIO from 'socket.io';
import { Logger } from '@overnightjs/logger';
import * as db from '../models';
import { UsersOnline } from '../helpers/users';

export enum GlobalEvents {
  CONNECT = 'connect',
  ISONLINE = 'is-online',
  ISOFFLINE = 'is-offline',
  DISCONNECT = 'disconnect',
  USERSONLINE = 'users-online',
  INITMODULE = 'init-module',
}

export enum GropChatEvents {
  GROUPMESSAGE = 'group-chat-message',
  PRIVATEMESSAGE = 'private-chat-message'
}

export class SocketRouter {
  public io: socketIO.Server;
  public usersOnline: UsersOnline;

  constructor() {
    this.usersOnline = new UsersOnline();
  }

  public initSocketConnection(io: socketIO.Server) {
    this.io = io;
    this.io.on(GlobalEvents.CONNECT, (socket: socketIO.Socket) => {
      Logger.Info(`Global: Client connected, socketId: ${socket.id}`);
      socket.on(GlobalEvents.ISONLINE, (user: db.User) => {
        Logger.Info(`Global: Client online, userId: ${user.id}`);
        const room = `ORG_ROOM_${user.OrganizationId.toString()}`;
        socket.join(room);
        this.usersOnline.addUser({
          id: user.id,
          fullname: `${user.name} ${user.surname}`,
          lastSocketId: socket.id,
          room
        });
        this.io.to(room).emit(GlobalEvents.USERSONLINE, this.usersOnline.getList(room));

        this.initCases(socket);
      });
      socket.on(GlobalEvents.ISOFFLINE, () => {
        const userLeft = this.usersOnline.removeUser(socket.id);
        if (userLeft) {
          this.io.to(userLeft.room).emit(GlobalEvents.USERSONLINE, this.usersOnline.getList(userLeft.room));
        }
      });
      socket.on(GlobalEvents.DISCONNECT, () => {
        Logger.Info(`Global: Client disconected, socketId: ${socket.id}`);
        const user = this.usersOnline.removeActiveSocket(socket.id);
        if (user) {
          this.io.to(user.room).emit(GlobalEvents.USERSONLINE, this.usersOnline.getList(user.room));
        }
      });
    });
  }

  private initCases(socket: socketIO.Socket) {
    socket.on(GlobalEvents.INITMODULE, (params: any) => {
      switch (params.moduleName) {
        case 'group-chat':
          this.initGruopChat(socket);
          break;
        case 'private-chat':
          this.initPrivateChat(socket);
          break;
        case 'notifications':
          this.initNotifications(socket);
          break;
      }
    });
  }

  private initGruopChat(socket: socketIO.Socket) {
    Logger.Info(`GroupChat: Module inited for socketId: ${socket.id}`);
    socket.on('join', (params: any) => {
      socket.join(params.room);
      Logger.Info('GroupChat: Client joined the group chat');
    });

    socket.on(GropChatEvents.GROUPMESSAGE, (m: any) => {
      Logger.Info(`[server](message): ${JSON.stringify(m.content)}`);
      this.io.to(m.room).emit(GropChatEvents.GROUPMESSAGE, m);
    });
  }

  private initPrivateChat(socket: socketIO.Socket) {
    Logger.Info(`PrivateChat: Module inited for socketId: ${socket.id}`);
    socket.on('join', (params: any) => {

    });

    socket.on(GropChatEvents.PRIVATEMESSAGE, (m: any) => {

    });
  }

  private initNotifications(socket: socketIO.Socket) {
    Logger.Info(`Notifications: Module inited for socketId: ${socket.id}`);
  }

  public onEventWithParams(event: string) {}
}
