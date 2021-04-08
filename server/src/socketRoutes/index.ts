import { Service } from 'typedi';
import { Socket, Server } from 'socket.io';

import { User } from '../repositories';
import { Logger } from '../utils/Logger';
import { SocketUtils, UserOnline } from '../utils/socket.utils';

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

@Service()
export class SocketRouter {
  public io: Server;

  constructor(private readonly socketHelper: SocketUtils, private readonly logger: Logger) {}

  public initSocketConnection(io: Server) {
    this.io = io;
    this.io.on(GlobalEvents.CONNECT, (socket: Socket) => {
      this.logger.info(`Global: Client connected, socketId: ${socket.id}`);
      socket.on(GlobalEvents.ISONLINE, (user: User) => {
        this.logger.info(`Global: Client online, userId: ${user.id}`);
        const OrgRoom = `ORG_ROOM_${user.OrganizationId.toString()}`;
        socket.join(OrgRoom);
        const userOnline: UserOnline = {
          id: user.id,
          name: user.name,
          surname: user.surname,
          fullname: `${user.name} ${user.surname}`,
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
        this.logger.info(`Global: Client disconected, socketId: ${socket.id}`);
        const user = this.socketHelper.removeActiveSocket(socket.id);
        if (user) {
          user.online = false;
          this.io.to(user.OrgRoom).emit(GlobalEvents.ISOFFLINE, user);
        }
      });
    });
  }

  private initCases(socket: Socket) {
    socket.on(GlobalEvents.INITMODULE, (params: any) => {
      switch (params.moduleName) {
        case 'notifications':
          this.initNotifications(socket);
          break;
      }
    });
  }

  private initNotifications(socket: Socket) {
    this.logger.info(`Notifications: Module inited for socketId: ${socket.id}`);
  }

  // public onEventWithParams(event: string) {}
}
