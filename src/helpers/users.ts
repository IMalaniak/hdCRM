export interface UserOnline {
  id: number;
  lastSocketId: string;
  activeSockets?: string[];
  fullname: string;
  room: string;
}

export class UsersOnline {
  private list: UserOnline[];

  constructor() {
    this.list = [];
  }

  public addUser(newUser: UserOnline) {
    const userExist = this.list.find(user => user.id === newUser.id);
    if (userExist) {
      userExist.activeSockets.push(newUser.lastSocketId);
    } else {
      newUser.activeSockets = [newUser.lastSocketId];
      this.list.push(newUser);
    }
  }

  public removeActiveSocket(lastSocketId: string) {
    const userExist = this.list.find(user => user.activeSockets.includes(lastSocketId));
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
    const userExist = this.list.find(user => user.activeSockets.includes(lastSocketId));
    if (userExist) {
        this.list = this.list.filter(user => user.id !== userExist.id);
    }
    return userExist;
  }

  public getList(room: string) {
    return this.list.filter(user => user.room === room);
  }
}
