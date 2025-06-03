import { io } from './index';
import { Room } from './types';
import { updateBallPosition, checkWallCollisions, checkPaddleCollisions, checkScore, checkGameOver } from './gameLogic';

const canvasWidth = 800;
const canvasHeight = 600;
const paddleWidth = 10;
const paddleHeight = 100;

export function startGameLoop(room: Room) {
  room.interval = setInterval(() => {
    updateBallPosition(room.gameState);
    checkWallCollisions(room.gameState, canvasHeight);
    checkPaddleCollisions(room.gameState, canvasWidth, paddleWidth, paddleHeight);
    checkScore(room.gameState, room.players, canvasWidth);

    if (checkGameOver(room.name, room.gameState, room.players)) {
      clearInterval(room.interval);
    } else {
      io.to(room.name).emit('gameStateUpdate', room.gameState);
    }
  }, 1000 / 60); // 60 FPS
}
