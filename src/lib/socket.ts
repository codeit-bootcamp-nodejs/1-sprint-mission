import http from 'http';
import { Server } from 'socket.io';
import { verifyAccessToken } from './token';

let io: Server | null = null;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.accessToken;
    if (!token) return next(new Error('Authentication error'));
    socket.data.userId = parseUserIdFromToken(token);
    next();
  });

  io.on('connection', (socket) => {
    console.log(`유저 연결됨: ${socket.data.userId}`);
    socket.join(String(socket.data.userId));
    socket.on('disconnect', () => {
      console.log(`유저 연결 종료됨: ${socket.data.userId}`);
    });
  });

  return io;
}

export function emitNotification(userId: number, notification: any) {
  if (!io) {
    console.warn('Socket.io 미초기화 상태');
    return;
  }
  io.to(String(userId)).emit('notification', notification);
}

function parseUserIdFromToken(token: string): number {
  try {
    const { userId } = verifyAccessToken(token);
    return userId;
  } catch (err) {
    console.error('JWT 검증 실패:', err);
    throw new Error('잘못된 토큰입니다.');
  }
}
