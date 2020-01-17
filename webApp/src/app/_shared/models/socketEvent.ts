// Socket.io events
export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ISONLINE = 'is-online',
  ISOFFLINE = 'is-offline',
  JOIN = 'join',
  USERSONLINE = 'users-online',
  INITMODULE = 'init-module',
  NEWCHATGROUP = 'new-chat-group',
  CHATMESSAGE = 'chat-message'
}
