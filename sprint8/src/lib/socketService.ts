import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

export class SocketService {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: '*', 
      },
    });

    this.io.use(this.authenticate);
    this.io.on('connection', this.onConnection);
  }

  private authenticate = (socket: AuthenticatedSocket, next: Function) => {
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

  private onConnection = (socket: AuthenticatedSocket) => {
    console.log(`✅ User ${socket.userId} connected via Socket.IO`);

    socket.on('disconnect', () => {
      console.log(`❌ User ${socket.userId} disconnected`);
    });
  };

  sendNotification(userId: number, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }
}
