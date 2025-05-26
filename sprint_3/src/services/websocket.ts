import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import NotFoundError from "../lib/error/NotFoundError";
import { JWT_SECRET } from "../lib/constants";

let io: Server;
const connectedUsers = new Map<number, Set<string>>();

export function setWebSocket(server: http.Server) {
  io = new Server(server);

  io.use((socket, next) => {
    const token = socket.handshake.auth.accessToken;
    if (!token) {
      return next(new NotFoundError("Token"));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET!);
      (socket as any).userId = (decoded as any).id;
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  console.log("Socket.IO is listening on");

  io.on("connection", (socket) => {
    const userId = (socket as any).userId;
    const existing = connectedUsers.get(userId) || new Set();
    existing.add(socket.id);
    connectedUsers.set(userId, existing);
    console.log(`유저 ${userId}가 socket ${socket.id}로 접속`);

    socket.on("disconnect", () => {
      console.log("User disconnect:", socket.id);
      for (const [userId, socketSet] of connectedUsers.entries()) {
        if (socketSet.has(socket.id)) {
          socketSet.delete(socket.id);
          if (socketSet.size === 0) {
            connectedUsers.delete(userId);
          } else {
            connectedUsers.set(userId, socketSet);
          }
          console.log(`유저 ${userId}의 socket ${socket.id} 연결 종료`);
          break;
        }
      }
    });
  });
}

export function sendNotificationToUser(userId: number, message: string) {
  const socketIds = connectedUsers.get(userId);
  if (socketIds && io) {
    for (const socketId of socketIds) {
      io.to(socketId).emit("notification", message);
    }
  } else {
    console.log(`유저 ${userId}는 현재 연결되어 있지 않음`);
  }
}
