import http from 'http';
import { PORT } from './lib/constants';
import { initializeSocketServer } from './socket/socketService';
import { setSocketIO } from './socket/socketInstance';
import app from './app';

const server = http.createServer(app);
const io = initializeSocketServer(server);
setSocketIO(io);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
