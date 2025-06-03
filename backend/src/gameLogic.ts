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

