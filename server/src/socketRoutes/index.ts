import socketIO from 'socket.io';
import { Logger } from '@overnightjs/logger';
import { User } from '../models';
import { SocketHelper } from '../helpers/socketHelper';

export enum GlobalEvents {
  CONNECT = 'connect',
  ISONLINE = 'is-online',
  ISOFFLINE = 'is-offline',
  DISCONNECT = 'disconnect',
  INITMODULE = 'init-module',
  JOIN = 'join',
  LEAVE = 'leave',
  USERSONLINE = 'users-online'
}

export class SocketRouter {
  public io: socketIO.Server;
  public socketHelper: SocketHelper;

  constructor() {
    this.socketHelper = new SocketHelper();
  }

  public initSocketConnection(io: socketIO.Server) {
    this.io = io;
    this.io.on(GlobalEvents.CONNECT, (socket: socketIO.Socket) => {
      Logger.Info(`Global: Client connected, socketId: ${socket.id}`);
      socket.on(GlobalEvents.ISONLINE, (user: User) => {
        Logger.Info(`Global: Client online, userId: ${user.id}`);
        const OrgRoom = `ORG_ROOM_${user.OrganizationId.toString()}`;
        socket.join(OrgRoom);
        const userOnline = {
          id: user.id,
          name: user.name,
          surname: user.surname,
          avatar: user.avatar,
          lastSocketId: socket.id,
          OrgRoom,
          rooms: [OrgRoom],
          online: true
        };
        this.socketHelper.addUser(userOnline);
        socket.to(OrgRoom).emit(GlobalEvents.ISONLINE, userOnline);

        this.initCases(socket);

        socket.on(GlobalEvents.USERSONLINE, () => {
          socket.emit(GlobalEvents.USERSONLINE, this.socketHelper.getOthersInRoom(userOnline.id, OrgRoom)); // emit only to myself
        });
      });
      socket.on(GlobalEvents.ISOFFLINE, () => {
        const userLeft = this.socketHelper.removeUser(socket.id);
        if (userLeft) {
          userLeft.online = false;
          this.io.to(userLeft.OrgRoom).emit(GlobalEvents.ISOFFLINE, userLeft);
        }
      });
      socket.on(GlobalEvents.DISCONNECT, () => {
        Logger.Info(`Global: Client disconected, socketId: ${socket.id}`);
        const user = this.socketHelper.removeActiveSocket(socket.id);
        if (user) {
          user.online = false;
          this.io.to(user.OrgRoom).emit(GlobalEvents.ISOFFLINE, user);
        }
      });
    });
  }

  private initCases(socket: socketIO.Socket) {
    socket.on(GlobalEvents.INITMODULE, (params: any) => {
      switch (params.moduleName) {
        case 'notifications':
          this.initNotifications(socket);
          break;
      }
    });
  }

  private initNotifications(socket: socketIO.Socket) {
    Logger.Info(`Notifications: Module inited for socketId: ${socket.id}`);
  }

  // public onEventWithParams(event: string) {}
}
