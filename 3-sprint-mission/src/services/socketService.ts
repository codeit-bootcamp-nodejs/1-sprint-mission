import { Server } from "socket.io";
import http from "http";
import { verifyAccessToken } from "../lib/token";

let io: Server;

export function setupSocket(server: http.Server) {
  io = new Server(server, {
    path: "/socket",
    cors: {
      origin: "*",
      credentials: true,
    },
  });
  console.log("소켓 서버 시작");

  io.use((socket, next) => {
    const { accessToken } = socket.handshake.auth;
    try {
      const payload = verifyAccessToken(accessToken);
      socket.data.userId = payload.userId;
      next();
    } catch (error) {
      console.log("소켓 인증실패", error);
      next(new Error("socket auth error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    console.log("소켓 연결됨 - socket.id:", socket.id);
    console.log("소켓 연결됨 - 유저 ID:", userId);
    console.log("소켓 연결완료 - 유저 명 : ", userId);
    socket.join(userId.toString());
    console.log("소켓 - 방 참가 완료:", userId);
    socket.on("disconnect", () => {
      console.log("소켓 - 연결 종료:", userId);
    });
  });
}

export function sendNotification(userId: number, notification: object) {
  if (!io) {
    console.log("소켓 서버 초기화 오류");
    return;
  }
  io.to(userId.toString()).emit("notification", notification);
}
