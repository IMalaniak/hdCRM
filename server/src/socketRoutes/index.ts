import socketIO from 'socket.io';
import { Logger } from '@overnightjs/logger';
import { User } from '../models';
import { ChatHelper } from '../helpers/chatHelper';

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

export enum GropChatEvents {
  NEWCHATGROUP = 'new-chat-group',
  GETGROUPCHATLIST = 'get-group-chat-list',
  GROUPCHATLIST = 'group-chat-list',
  GROUPMESSAGE = 'group-chat-message',
  PRIVATEMESSAGE = 'private-chat-message'
}

export class SocketRouter {
  public io: socketIO.Server;
  public chatHelper: ChatHelper;

  constructor() {
    this.chatHelper = new ChatHelper();
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
        this.chatHelper.addUser(userOnline);
        socket.to(OrgRoom).emit(GlobalEvents.ISONLINE, userOnline);

        this.initCases(socket);

        socket.on(GlobalEvents.USERSONLINE, () => {
          socket.emit(GlobalEvents.USERSONLINE, this.chatHelper.getOthersInRoom(userOnline.id, OrgRoom)); // emit only to myself
        });
      });
      socket.on(GlobalEvents.ISOFFLINE, () => {
        const userLeft = this.chatHelper.removeUser(socket.id);
        if (userLeft) {
          userLeft.online = false;
          this.io.to(userLeft.OrgRoom).emit(GlobalEvents.ISOFFLINE, userLeft);
        }
      });
      socket.on(GlobalEvents.DISCONNECT, () => {
        Logger.Info(`Global: Client disconected, socketId: ${socket.id}`);
        const user = this.chatHelper.removeActiveSocket(socket.id);
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
        case 'group-chat':
          this.initGroupChat(socket);
          break;
        case 'notifications':
          this.initNotifications(socket);
          break;
      }
    });
  }

  private initGroupChat(socket: socketIO.Socket) {
    Logger.Info(`GroupChat: Module inited for socketId: ${socket.id}`);
    const user = this.chatHelper.getUser(socket.id);

    socket.on(GropChatEvents.GETGROUPCHATLIST, () => {
      Logger.Info(`Getting groupchat list`);
      this.io.to(user.OrgRoom).emit(GropChatEvents.GROUPCHATLIST, this.chatHelper.getGroupChatList(user.OrgRoom));
    });

    socket.on(GropChatEvents.NEWCHATGROUP, (params: any) => {
      Logger.Info(`Creating new group chat with name: ${params}`);
      const newChat = this.chatHelper.createGroupChat(params, user.OrgRoom);
      this.io.to(newChat.OrgRoom).emit(GropChatEvents.NEWCHATGROUP, newChat);
    });

    socket.on(GlobalEvents.JOIN, (params: any) => {
      socket.join(params.room);
      user.rooms.push(params.room);
      Logger.Info(`GroupChat: Client joined the '${params.room}' group chat`);
    });

    socket.on(GlobalEvents.LEAVE, (params: any) => {
      socket.leave(params.room);
      Logger.Info(`GroupChat: Client left the '${params.room}' group chat`);
    });

    socket.on(GropChatEvents.GROUPMESSAGE, (m: any) => {
      this.chatHelper.createChatMessage(m);
      this.io.to(m.room).emit(GropChatEvents.GROUPMESSAGE, m);
    });
  }

  // private initPrivateChat(socket: socketIO.Socket) {
  //   Logger.Info(`PrivateChat: Module inited for socketId: ${socket.id}`);
  //   socket.on('join', (params: any) => {});

  //   socket.on(GropChatEvents.PRIVATEMESSAGE, (m: any) => {});
  // }

  private initNotifications(socket: socketIO.Socket) {
    Logger.Info(`Notifications: Module inited for socketId: ${socket.id}`);
  }

  // public onEventWithParams(event: string) {}
}
