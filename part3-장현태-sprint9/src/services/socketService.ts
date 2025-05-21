import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

let io: Server;
const userSocketMap = new Map<number, Set<string>>();
// userSocketMap 예시, 하나의 유저가 여러 개의 소켓서버 연결을 가질 수 있음
// Map {
//   {userId1} => Set { 'socketId_abc123', 'socketId_xyz456' },
//   {userId2} => Set { 'socketId_qwe789' }
// }

export const createSocketServer = (server: http.Server) => {
  io = new Server(server);
  console.log("Socket.IO is listening on path /socket.io");

  io.use((socket, next) => {
    const token = socket.handshake.auth.accessToken;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    const userId = socket.data.user.userId;
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId)!.add(socket.id);

    socket.on("disconnect", () => {
      const userSockets = userSocketMap.get(userId); //해당 유저가 연결한 소켓들의 Set을 가져옴.
      if (userSockets) {
        //userSockets가 존재안할리가없지만. 안전장치로 유무검사
        userSockets.delete(socket.id); //지금 끊긴 소켓 ID를 Set에서 제거.
        if (userSockets.size === 0) {
          userSocketMap.delete(userId); //userSocketMap에 아무 소켓도 없으면 제거
        }
      }
      console.log("user disconnected");
    });
  });

  return io;
};

export const getIO = () => io;
export const getSocketIdByUserId = (userId: number) => {
  return userSocketMap.get(userId);
};

export const emitNotification = (
  userId: number,
  notification: { message: string; type: string }
) => {
  const socketIds = getSocketIdByUserId(userId);
  if (socketIds) {
    socketIds.forEach((socketId) => {
      io.to(socketId).emit("notification", notification);
    });
  }
};
