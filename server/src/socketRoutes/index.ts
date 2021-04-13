import { Service } from 'typedi';
import { Socket, Server } from 'socket.io';

import { User } from '../repositories';
import { Logger } from '../utils/Logger';
import { SocketUtils, UserOnline } from '../utils/socket.utils';

export enum GLOBAL_EVENTS {
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
  public io!: Server;

  constructor(private readonly socketHelper: SocketUtils, private readonly logger: Logger) {}

  public initSocketConnection(io: Server): void {
    this.io = io;
    this.io.on(GLOBAL_EVENTS.CONNECT, (socket: Socket) => {
      this.logger.info(`Global: Client connected, socketId: ${socket.id}`);
      socket.on(GLOBAL_EVENTS.ISONLINE, (user: User) => {
        this.logger.info(`Global: Client online, userId: ${user.id}`);
        const orgRoom = `ORG_ROOM_${user.OrganizationId.toString()}`;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        socket.join(orgRoom);
        const userOnline: UserOnline = {
          id: user.id,
          name: user.name,
          surname: user.surname,
          fullname: `${user.name} ${user.surname}`,
          avatar: user.avatar,
          lastSocketId: socket.id,
          orgRoom,
          rooms: [orgRoom],
          online: true,
          activeSockets: []
        };
        this.socketHelper.addUser(userOnline);
        socket.to(orgRoom).emit(GLOBAL_EVENTS.ISONLINE, userOnline);

        this.initCases(socket);

        socket.on(GLOBAL_EVENTS.USERSONLINE, () => {
          socket.emit(GLOBAL_EVENTS.USERSONLINE, this.socketHelper.getOthersInRoom(userOnline.id, orgRoom)); // emit only to myself
        });
      });
      socket.on(GLOBAL_EVENTS.ISOFFLINE, () => {
        const userLeft = this.socketHelper.removeUser(socket.id);
        if (userLeft) {
          userLeft.online = false;
          this.io.to(userLeft.orgRoom).emit(GLOBAL_EVENTS.ISOFFLINE, userLeft);
        }
      });
      socket.on(GLOBAL_EVENTS.DISCONNECT, () => {
        this.logger.info(`Global: Client disconected, socketId: ${socket.id}`);
        const user = this.socketHelper.removeActiveSocket(socket.id);
        if (user) {
          user.online = false;
          this.io.to(user.orgRoom).emit(GLOBAL_EVENTS.ISOFFLINE, user);
        }
      });
    });
  }

  private initCases(socket: Socket) {
    socket.on(GLOBAL_EVENTS.INITMODULE, (params: { [key: string]: string }) => {
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
