import { GameState } from './types';

export function updateBallPosition(gameState: GameState) {
  gameState.ballX += gameState.ballVelocityX;
  gameState.ballY += gameState.ballVelocityY;
}

export function checkWallCollisions(gameState: GameState, canvasHeight: number) {
    if (gameState.ballY <= 0 || gameState.ballY >= canvasHeight) {
        gameState.ballVelocityY *= -1;
    }
}

