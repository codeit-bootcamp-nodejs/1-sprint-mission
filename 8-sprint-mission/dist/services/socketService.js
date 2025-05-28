"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = setupSocket;
exports.sendNotification = sendNotification;
const socket_io_1 = require("socket.io");
const token_1 = require("../lib/token");
let io;
function setupSocket(server) {
    io = new socket_io_1.Server(server, {
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
            const payload = (0, token_1.verifyAccessToken)(accessToken);
            socket.data.userId = payload.userId;
            next();
        }
        catch (error) {
            console.log("소켓 인증실패", error);
            next(new Error("socket auth error"));
        }
    });
    /* */
    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        console.log("소켓 연결됨 - socket.id:", socket.id);
        socket.join(userId.toString());
        console.log("소켓 - 방 참가 완료:", userId);
        socket.on("disconnect", () => {
            console.log("소켓 - 연결 종료:", userId);
        });
    });
}
function sendNotification(userId, notification) {
    if (!io) {
        console.log("소켓 서버 초기화 오류");
        return;
    }
    io.to(userId.toString()).emit("notification", notification);
}
