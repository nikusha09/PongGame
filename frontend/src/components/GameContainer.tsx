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

const paddleWidth = 10;
const paddleHeight = 100;

const drawGame = (gameState: GameState) => (ctx: CanvasRenderingContext2D) => {
  if (!gameState) return;

  // Clear canvas
  ctx.clearRect(0, 0, 800, 600);

  // Draw ball
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Draw paddles
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

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [inputDirection, setInputDirection] = useState<null | 'up' | 'down'>(null);
  const [winnerId, setWinnerId] = useState<string | null>(null);

  useEffect(() => {
    // Listen for game state updates
    socket.on('gameState', (state: GameState) => {
      setGameState(state);
    });

    socket.on('gameOver', (winnerId: string) => {
      setWinnerId(winnerId);
    });

    return () => {
      socket.off('gameState');
      socket.off('gameOver');
    };
  }, []);

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

  // Render game canvas and winner overlay
  return (
    <>
      {gameState ? (
        <GameCanvas draw={drawGame(gameState)} />
      ) : (
        <div>Waiting for game to start...</div>
      )}

      {winnerId && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          Player {winnerId} wins!
        </div>
      )}
    </>
  );
};

export default GameContainer;
