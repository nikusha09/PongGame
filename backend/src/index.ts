import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 4000;

const waitingPlayers: string[] = [];

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  waitingPlayers.push(socket.id);
  // If two or more players are waiting, pair into a room
  if (waitingPlayers.length >= 2) {
    const player1 = waitingPlayers.shift()!;
    const player2 = waitingPlayers.shift()!;
    const roomName = `room-${player1}-${player2}`;

    io.sockets.sockets.get(player1)?.join(roomName);
    io.sockets.sockets.get(player2)?.join(roomName);

    io.to(roomName).emit('roomAssigned', { room: roomName, players: [player1, player2] });
    console.log(`Room created: ${roomName} with players ${player1} and ${player2}`);
  }

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    
    // Remove from waiting queue if still waiting
    const index = waitingPlayers.indexOf(socket.id);
    if (index !== -1) waitingPlayers.splice(index, 1);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export { io };
