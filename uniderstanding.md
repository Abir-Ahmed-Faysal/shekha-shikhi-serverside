chat-app/
├─ server/
│ ├─ Dockerfile
│ ├─ package.json
│ ├─ tsconfig.json
│ ├─ src/
│ │ ├─ index.ts # bootstrap + http server + socket.io
│ │ ├─ app.ts # express app, middlewares
│ │ ├─ socket.ts # socket handlers
│ │ ├─ services/
│ │ │ └─ messageStore.ts # simple in-memory store (swap for DB/Redis)
│ │ └─ utils/
│ │ └─ logger.ts
│ └─ .env
├─ client/
│ ├─ Dockerfile
│ ├─ package.json
│ ├─ tsconfig.json
│ ├─ vite.config.ts
│ ├─ src/
│ │ ├─ main.tsx
│ │ ├─ App.tsx
│ │ ├─ services/socket.ts
│ │ ├─ components/
│ │ │ ├─ ChatRoom.tsx
│ │ │ ├─ MessageList.tsx
│ │ │ └─ MessageInput.tsx
│ │ └─ styles.css
│ └─ .env
└─ docker-compose.yml


Key design decisions (why this is production oriented)

TypeScript everywhere: predictable types, easier refactor.

Express + Socket.IO on same HTTP server: simple deployment behind a proxy (NGINX) and consistent CORS handling.

Separation of concerns: socket logic separated from express app and simple store service.

Ready to scale: docker-compose + instructions for socket.io-redis adapter.

Observability: simple logger abstraction (replaceable with winston/pino).

Swap-in persistence: in-memory store included for quick start; swap for Postgres/Mongo/Redis for production.

Server — Important files


server/src/index.ts
import http from 'http';
import { createApp } from './app';
import { createSocket } from './socket';
import { logger } from './utils/logger';
import dotenv from 'dotenv';


dotenv.config();server/src/index.ts




const app = createApp();
const server = http.createServer(app);


const io = createSocket(server);


const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
server.listen(PORT, () => {
logger.info(`Server listening on port ${PORT}`);
});


// Graceful shutdown
process.on('SIGINT', () => {
logger.info('SIGINT received — shutting down');
io.close();
server.close(() => process.exit(0));
});



server/src/app.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger';


dotenv.config();


export function createApp() {
const app = express();


app.use(cors({
origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
credentials: true,
}));


app.use(express.json());


app.get('/health', (_req, res) => res.json({ ok: true }));


// small diagnostics route
app.get('/', (_req, res) => {
res.send('Chat server is running');
});


// more routes (auth, history) could be added here


// basic error handler
app.use((err: any, _req: any, res: any, _next: any) => {
logger.error(err);
res.status(err.status || 500).json({ message: err.message || 'internal error' });
});


return app;
}



server/src/socket.ts

import { Server as HttpServer } from 'http';
});


io.on('connection', (socket: Socket) => {
logger.info(`socket connected: ${socket.id}`);


socket.on('join', (payload: { room: string; username: string }) => {
const { room, username } = payload;
socket.join(room);
socket.data.username = username;
logger.info(`${username} joined ${room}`);


// send last 50 messages
const history = store.getRoomMessages(room, 50);
socket.emit('history', history);


// notify others in room
socket.to(room).emit('user:joined', { user: username });
});


socket.on('message', (msg: { room: string; text: string }) => {
const username = socket.data.username || 'anonymous';
if (!msg.room || typeof msg.text !== 'string') return;


const message = {
id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
room: msg.room,
text: msg.text.trim(),
user: username,
createdAt: new Date().toISOString(),
};


store.addMessage(msg.room, message);


io.to(msg.room).emit('message', message);
});


socket.on('leave', (room: string) => {
const username = socket.data.username || 'anonymous';
socket.leave(room);
socket.to(room).emit('user:left', { user: username });
});


socket.on('disconnect', (reason) => {
logger.info(`socket ${socket.id} disconnected: ${reason}`);
});
});


return io;
}



server/src/services/messageStore.ts

type Message = {
id: string;
room: string;
user: string;
text: string;
createdAt: string;
};


export class MessageStore {
private rooms: Map<string, Message[]> = new Map();


addMessage(room: string, message: Message) {
const arr = this.rooms.get(room) || [];
arr.push(message);
// keep last 500 messages to prevent unbounded memory growth
if (arr.length > 500) arr.splice(0, arr.length - 500);
this.rooms.set(room, arr);
}


getRoomMessages(room: string, limit = 50) {
const arr = this.rooms.get(room) || [];
return arr.slice(-limit);
}


clearRoom(room: string) {
this.rooms.delete(room);
}
}

server/src/utils/logger.ts


export const logger = {
info: (...args: any[]) => console.info('[INFO]', ...args),
warn: (...args: any[]) => console.warn('[WARN]', ...args),
error: (...args: any[]) => console.error('[ERROR]', ...args),
};



