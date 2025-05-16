import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';
import http from 'http';
import { Notification } from '@prisma/client';

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

export class SocketService {
  private static instance: SocketService;
  private io: Server;

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: '*', 
      },
    });

    this.io.use(this.authenticate);
    this.io.on('connection', this.onConnection);

    SocketService.instance = this;
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      throw new Error('SocketService has not been initialized.');
    }
    return SocketService.instance;
  }

  private authenticate = (socket: AuthenticatedSocket, next: (err?: Error) => void): void => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('No token');

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!) as UserPayload;
      socket.userId = decoded.userId;

      socket.join(`user:${socket.userId}`);
      next();
    } catch (err) {
      console.error('Socket auth failed:', err);
      next(new Error('Authentication error'));
    }
  };

  private onConnection = (socket: AuthenticatedSocket): void => {
    console.log(`✅ User ${socket.userId} connected via Socket.IO`);

    socket.on('disconnect', () => {
      console.log(`❌ User ${socket.userId} disconnected`);
    });
  };

  sendNotification(userId: number, notification: Notification): void {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }
}
