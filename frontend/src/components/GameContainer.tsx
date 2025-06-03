import React, { useEffect, useState } from 'react';
import GameCanvas from './GameCanvas';
import socket from '../socket';

interface Player {
  paddleY: number;
  score: number;
}

interface GameState {
  ballX: number;
  ballY: number;
  players: { [id: string]: Player };
}

interface Props {
  gameState: GameState;
  onPlayerMove?: (direction: 'up' | 'down' | null) => void;
}

const paddleWidth = 10;
const paddleHeight = 100;

const drawGame = (gameState: GameState) => (ctx: CanvasRenderingContext2D) => {
  // Clear canvas
  ctx.clearRect(0, 0, 800, 600);

  // Draw ball
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Draw paddles (left and right)
  const playerIds = Object.keys(gameState.players);
  if (playerIds.length >= 2) {
    const leftPlayer = gameState.players[playerIds[0]];
    const rightPlayer = gameState.players[playerIds[1]];

    ctx.fillRect(0, leftPlayer.paddleY, paddleWidth, paddleHeight);
    ctx.fillRect(800 - paddleWidth, rightPlayer.paddleY, paddleWidth, paddleHeight);

    // Draw scores
    ctx.font = '30px Arial';
    ctx.fillText(String(leftPlayer.score), 300, 50);
    ctx.fillText(String(rightPlayer.score), 500, 50);
  }
};

const GameContainer: React.FC<Props> = ({ gameState, onPlayerMove }) => {

  const [inputDirection, setInputDirection] = useState<null | 'up' | 'down'>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setInputDirection('up');
      else if (e.key === 'ArrowDown') setInputDirection('down');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && inputDirection === 'up') setInputDirection(null);
      else if (e.key === 'ArrowDown' && inputDirection === 'down') setInputDirection(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [inputDirection]);

  useEffect(() => {
    if (inputDirection) {
      socket.emit('movePaddle', inputDirection);
    } else {
      socket.emit('stopPaddle');
    }
  }, [inputDirection]);

  return <GameCanvas draw={drawGame(gameState)} />;
};

export default GameContainer;