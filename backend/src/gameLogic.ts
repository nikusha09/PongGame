import { GameState } from './types';

export function updateBallPosition(gameState: GameState) {
  gameState.ballX += gameState.ballVelocityX;
  gameState.ballY += gameState.ballVelocityY;
}