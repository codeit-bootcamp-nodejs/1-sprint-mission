import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

let io: Server;
const userSocketMap = new Map<number, Set<string>>();

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
      const userSockets = userSocketMap.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          userSocketMap.delete(userId);
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