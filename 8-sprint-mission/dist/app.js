"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const main_1 = __importDefault(require("./main"));
const socketService_1 = require("./services/socketService");
const constants_1 = require("./lib/constants");
const server = http_1.default.createServer(main_1.default);
(0, socketService_1.setupSocket)(server);
server.listen(constants_1.PORT, () => {
    console.log(`Server started on port ${constants_1.PORT}`);
});
