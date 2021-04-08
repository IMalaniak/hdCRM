import { Service } from 'typedi';

export interface UserOnline {
  id: number;
  name: string;
  surname: string;
  fullname: string;
  avatar: any; // TODO Asset
  lastSocketId: string;
  activeSockets?: string[];
  OrgRoom: string;
  rooms?: string[];
  online: boolean;
}

@Service()
export class SocketUtils {
  private userList: UserOnline[];

  constructor() {
    this.userList = [];
  }

  public addUser(newUser: UserOnline) {
    let userExist: UserOnline = this.userList.find((user) => user.id === newUser.id);
    if (userExist) {
      userExist = { ...userExist, activeSockets: [...userExist.activeSockets, newUser.lastSocketId] };
    } else {
      newUser = { ...newUser, activeSockets: [newUser.lastSocketId] };
      this.userList = [...this.userList, newUser];
    }
  }

  public removeActiveSocket(lastSocketId: string) {
    const userExist: UserOnline = this.userList.find((user) => user.activeSockets.includes(lastSocketId));
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
    const userExist: UserOnline = this.userList.find((user) => user.activeSockets.includes(lastSocketId));
    if (userExist) {
      this.userList = this.userList.filter((user) => user.id !== userExist.id);
    }
    return userExist;
  }

  public getUser(lastSocketId: string) {
    return this.userList.find((user) => user.activeSockets.includes(lastSocketId));
  }

  public getUsersList(room: string) {
    return this.userList.filter((user) => user.rooms.includes(room));
  }

  public getOthersInRoom(currentUserId: number, room: string) {
    return this.getUsersList(room).filter((user) => user.id !== currentUserId);
  }

  // public joinRoom(user: UserOnline, room: string) {
  //   user.rooms.push(room);
  // }
}
