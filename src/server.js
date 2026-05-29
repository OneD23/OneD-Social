import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

const app = createApp();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: env.corsOrigin.includes('*') ? '*' : env.corsOrigin, credentials: true },
});

io.on('connection', (socket) => {
  socket.on('join:user', (userId) => socket.join(`user:${userId}`));
  socket.on('disconnect', () => undefined);
});

await connectDatabase();

server.listen(env.port, () => {
  console.log(`OneD Social API running on port ${env.port}`);
});
