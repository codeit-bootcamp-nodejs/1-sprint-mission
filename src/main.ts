import { createServer } from 'http';
import app from './app';
import { PORT } from './lib/constants';
import socketService from './services/socketService';

const server = createServer(app);

socketService.initialize(server);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
