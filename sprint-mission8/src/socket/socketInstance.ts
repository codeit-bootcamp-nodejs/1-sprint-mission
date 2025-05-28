import { Server } from 'socket.io';

let io: Server;

export function setSocketIO(server: Server) {
  io = server;
}

export function getSocketIO(): Server {
  return io;
}
