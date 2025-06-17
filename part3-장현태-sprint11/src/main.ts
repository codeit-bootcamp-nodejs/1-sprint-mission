import app from "./app";
import http from "http";
import { createSocketServer } from "./services/socketService";

const server = http.createServer(app);
createSocketServer(server);
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
