import socketIO from 'socket.io';
import { Logger } from '@overnightjs/logger';
import * as db from '../models';
import { ChatHelper } from '../helpers/chatHelper';

export enum GlobalEvents {
  CONNECT = 'connect',
  ISONLINE = 'is-online',
  ISOFFLINE = 'is-offline',
  DISCONNECT = 'disconnect',
  chatHelper = 'users-online',
  INITMODULE = 'init-module',
  JOIN = 'join',
  LEAVE = 'leave'
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
      socket.on(GlobalEvents.ISONLINE, (user: db.User) => {
        Logger.Info(`Global: Client online, userId: ${user.id}`);
        const OrgRoom = `ORG_ROOM_${user.OrganizationId.toString()}`;
        socket.join(OrgRoom);
        this.chatHelper.addUser({
          id: user.id,
          fullname: `${user.name} ${user.surname}`,
          lastSocketId: socket.id,
          OrgRoom,
          rooms: [OrgRoom]
        });
        this.io.to(OrgRoom).emit(GlobalEvents.chatHelper, this.chatHelper.getUserList(OrgRoom));

        this.initCases(socket);
      });
      socket.on(GlobalEvents.ISOFFLINE, () => {
        const userLeft = this.chatHelper.removeUser(socket.id);
        if (userLeft) {
          this.io.to(userLeft.OrgRoom).emit(GlobalEvents.chatHelper, this.chatHelper.getUserList(userLeft.OrgRoom));
        }
      });
      socket.on(GlobalEvents.DISCONNECT, () => {
        Logger.Info(`Global: Client disconected, socketId: ${socket.id}`);
        const user = this.chatHelper.removeActiveSocket(socket.id);
        if (user) {
          this.io.to(user.OrgRoom).emit(GlobalEvents.chatHelper, this.chatHelper.getUserList(user.OrgRoom));
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
        case 'private-chat':
          this.initPrivateChat(socket);
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
