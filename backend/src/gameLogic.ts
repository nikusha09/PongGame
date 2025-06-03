import { GameState } from './types';
import { io } from './index';


export function updateBallPosition(gameState: GameState) {
  gameState.ballX += gameState.ballVelocityX;
  gameState.ballY += gameState.ballVelocityY;
}

export function checkWallCollisions(gameState: GameState, canvasHeight: number) {
    if (gameState.ballY <= 0 || gameState.ballY >= canvasHeight) {
        gameState.ballVelocityY *= -1;
    }
}

export function checkPaddleCollisions(gameState: GameState, canvasWidth: number, paddleWidth: number, paddleHeight: number) {
    for (const playerId in gameState.players) {
        const player = gameState.players[playerId];

        // Left paddle:
        if (gameState.ballX <= paddleWidth && gameState.ballY >= player.paddleY && gameState.ballY <= player.paddleY + paddleHeight) {
            gameState.ballVelocityX *= -1;
        }

        // Right paddle:
        if (gameState.ballX >= canvasWidth - paddleWidth && gameState.ballY >= player.paddleY && gameState.ballY <= player.paddleY + paddleHeight) {
            gameState.ballVelocityX *= -1;
        }
    }
}

export function checkScore(gameState: GameState, roomPlayers: string[], canvasWidth: number) {
    // Right scores
    if (gameState.ballX < 0) {
        gameState.players[roomPlayers[1]].score++;
        resetBall(gameState);
    }
    // Left scores
    if (gameState.ballX > canvasWidth) {
        gameState.players[roomPlayers[0]].score++;
        resetBall(gameState);
    }
}

function resetBall(gameState: GameState) {
    // Position ball in center
    gameState.ballX = 400;
    gameState.ballY = 300;
    gameState.ballVelocityX = 5 * (Math.random() > 0.5 ? 1 : -1);
    gameState.ballVelocityY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

export function checkGameOver(roomName: string, gameState: GameState, roomPlayers: string[]) {
  for (const playerId of roomPlayers) {
    // Game is up to 5
    if (gameState.players[playerId].score >= 5) {
      io.to(roomName).emit('gameOver', playerId);
      return true;
    }
  }
  return false;
}