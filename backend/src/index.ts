import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { Room, Player, GameState } from './types';
import { startGameLoop } from './gameLoop';

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
const rooms: { [roomName: string]: Room } = {};

// Helper: find which room a player belongs to
function findPlayerRoom(playerId: string): string | null {
  for (const roomName in rooms) {
    if (rooms[roomName].players.includes(playerId)) {
      return roomName;
    }
  }
  return null;
}

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  waitingPlayers.push(socket.id);

  // If 2 or more waiting players, create a room
  if (waitingPlayers.length >= 2) {
    const player1Id = waitingPlayers.shift()!;
    const player2Id = waitingPlayers.shift()!;
    const roomName = `room-${player1Id}-${player2Id}`;

    // Create player objects
    const player1: Player = { id: player1Id, paddleY: 250, score: 0 };
    const player2: Player = { id: player2Id, paddleY: 250, score: 0 };

    // Initialize game state
    const initialGameState: GameState = {
      ballX: 400,
      ballY: 300,
      ballVelocityX: 5 * (Math.random() > 0.5 ? 1 : -1),
      ballVelocityY: 5 * (Math.random() > 0.5 ? 1 : -1),
      players: {
        [player1.id]: player1,
        [player2.id]: player2,
      },
    };

    // Create room state
    rooms[roomName] = {
      name: roomName,
      players: [player1.id, player2.id],
      gameState: initialGameState,
    };

    // Join sockets to room
    io.sockets.sockets.get(player1Id)?.join(roomName);
    io.sockets.sockets.get(player2Id)?.join(roomName);

    // Notify players
    io.to(roomName).emit('roomAssigned', { room: roomName, players: [player1Id, player2Id] });
    console.log(`Room created: ${roomName} with players ${player1Id} and ${player2Id}`);

    // Start the game loop for this room
    startGameLoop(rooms[roomName]);
  }

  // Listen for paddle movement updates from clients
  socket.on('paddleMove', ({ position }: { position: number }) => {
    const roomName = findPlayerRoom(socket.id);
    if (!roomName) return;

    const room = rooms[roomName];
    const player = room.gameState.players[socket.id];
    if (player) {
      // Clamp paddle position within reasonable bounds (0 to canvas height - paddle height)
      const clampedPosition = Math.max(0, Math.min(position, 600 - 100));
      player.paddleY = clampedPosition;
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);

    // Remove from waiting queue if waiting
    const waitingIndex = waitingPlayers.indexOf(socket.id);
    if (waitingIndex !== -1) waitingPlayers.splice(waitingIndex, 1);

    // Remove player from their room and cleanup
    const roomName = findPlayerRoom(socket.id);
    if (roomName) {
      const room = rooms[roomName];
      // Remove player from room
      room.players = room.players.filter((id) => id !== socket.id);
      delete room.gameState.players[socket.id];

      // If no players left, clear interval and delete room
      if (room.players.length === 0) {
        if (room.interval) clearInterval(room.interval);
        delete rooms[roomName];
        console.log(`Room ${roomName} deleted due to no players.`);
      } else {
        // Notify remaining player the opponent disconnected (optional)
        io.to(roomName).emit('opponentLeft');
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export { io };
