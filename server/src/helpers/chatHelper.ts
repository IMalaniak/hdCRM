export interface UserOnline {
  id: number;
  name: string;
  surname: string;
  avatar: any; // TODO Asset
  lastSocketId: string;
  activeSockets?: string[];
  OrgRoom: string;
  rooms?: string[];
  online: boolean;
}

export interface GroupChat {
  id: number;
  name: string;
  OrgRoom: string;
  room: string;
  createdAt: Date;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id?: number;
  content?: string;
  sender: UserOnline;
  room: string;
  createdAt: Date;
}

export class ChatHelper {
  private userList: UserOnline[];
  private groupChatList: GroupChat[];

  constructor() {
    this.userList = [];
    this.groupChatList = [];
  }

  public addUser(newUser: UserOnline) {
    const userExist = this.userList.find(user => user.id === newUser.id);
    if (userExist) {
      userExist.activeSockets.push(newUser.lastSocketId);
    } else {
      newUser.activeSockets = [newUser.lastSocketId];
      this.userList.push(newUser);
    }
  }

  public removeActiveSocket(lastSocketId: string) {
    const userExist = this.userList.find(user => user.activeSockets.includes(lastSocketId));
    if (userExist) {
      if (userExist.activeSockets.length >= 2) {
        const i = userExist.activeSockets.indexOf(lastSocketId);
        userExist.activeSockets.splice(i, 1);
      } else {
        this.removeUser(lastSocketId);
      }
    }
    return userExist;
  }

  public removeUser(lastSocketId: string) {
    const userExist = this.userList.find(user => user.activeSockets.includes(lastSocketId));
    if (userExist) {
        this.userList = this.userList.filter(user => user.id !== userExist.id);
    }
    return userExist;
  }

  public getUser(lastSocketId: string) {
    return this.userList.find(user => user.activeSockets.includes(lastSocketId));
  }

  public getUsersList(room: string) {
    return this.userList.filter(user => user.rooms.includes(room));
  }

  public getOthersInRoom(currentUserId: number, room: string) {
    return this.getUsersList(room).filter(user => user.id !== currentUserId);
  }

  public createGroupChat(name: string, OrgRoom: string) {
    const newGChat: GroupChat = {
      id: new Date().valueOf(),
      name,
      OrgRoom,
      room: `${OrgRoom}_GROUP_CHAT_${name}`,
      createdAt: new Date(),
      messages: []
    };
    this.groupChatList.push(newGChat);
    return newGChat;
  }

  public getGroupChatList(OrgRoom: string) {
    return this.groupChatList.filter(chat => chat.OrgRoom === OrgRoom);
  }

  public getGroupChat(room: string) {
    return this.groupChatList.find(chat => chat.room === room);
  }

  public createChatMessage(message: ChatMessage) {
    this.getGroupChat(message.room).messages.push(message);
  }

  // public joinRoom(user: UserOnline, room: string) {
  //   user.rooms.push(room);
  // }

}
