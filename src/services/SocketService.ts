import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import http from 'http';
import { JWT_ACCESS_TOKEN_SECRET } from '../lib/constants';

interface AuthPayload {
  id: number;
}

let io: Server | null = null;

export function setupWebSocket(server: http.Server) {
  io = new Server(server, {
    path: '/chat',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('Socket.IO is listening on path: /chat');

  io.use((socket, next) => {
    const accessToken = socket.handshake.auth.accessToken;
    if (!accessToken) {
      return next(new Error('인증 토큰이 없습니다.'));
    }

    try {
      const payload = jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET!) as AuthPayload;
      (socket as any).userId = payload.id;
      next();
    } catch (err) {
      return next(new Error('유효하지 않은 토큰입니다.'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    if (!userId) {
      console.warn('userId 없음. 연결 거부.');
      return;
    }

    socket.join(`user:${userId}`);
    console.log(`유저 ${userId} 연결됨 (소켓 ID: ${socket.id})`);

    socket.on('disconnect', () => {
      console.log(`유저 ${userId} 연결 종료 (소켓 ID: ${socket.id})`);
    });
  });
}

export function sendNotification(userId: number, payload: object) {
  if (!io) {
    throw new Error('Socket.IO is not initialized. Call setupWebSocket(server) first.');
  }

  io.to(`user:${userId}`).emit('notification', payload);
  console.log(`유저 ${userId}에게 알림 전송됨:`, payload);
}
