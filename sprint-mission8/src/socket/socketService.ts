import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/constants';

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

const userRooms = new Map<number, Set<string>>();

export function initializeSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token provided'));

    try {
      const payload = jwt.verify(token, JWT_SECRET) as { id: number };
      socket.userId = payload.id;

      if (!userRooms.has(payload.id)) {
        userRooms.set(payload.id, new Set());
      }
      userRooms.get(payload.id)!.add(socket.id);

      socket.join(`user:${payload.id}`);
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected via socket ${socket.id}`);

    socket.on('disconnect', () => {
      if (socket.userId && userRooms.has(socket.userId)) {
        userRooms.get(socket.userId)!.delete(socket.id);
        if (userRooms.get(socket.userId)!.size === 0) {
          userRooms.delete(socket.userId);
        }
      }
      console.log(`User ${socket.userId} disconnected from socket ${socket.id}`);
    });
  });

  return io;
}

export function sendNotification(io: Server, userId: number, notification: any) {
  io.to(`user:${userId}`).emit('notification', notification);
}
