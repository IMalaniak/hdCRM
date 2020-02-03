// Socket.io events
export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ISONLINE = 'is-online',
  ISOFFLINE = 'is-offline',
  JOIN = 'join',
  LEAVE = 'leave',
  USERSONLINE = 'users-online',
  INITMODULE = 'init-module',
  NEWCHATGROUP = 'new-chat-group',
  GETGROUPCHATLIST = 'get-group-chat-list',
  GROUPCHATLIST = 'group-chat-list',
  GROUPMESSAGE = 'group-chat-message',
  PRIVATEMESSAGE = 'private-chat-message'
}
