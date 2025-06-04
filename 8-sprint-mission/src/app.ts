import http from "http";
import app from "../src/main";
import { setupSocket } from "./services/socketService";
import { PORT } from "./lib/constants";

const server = http.createServer(app);
setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
