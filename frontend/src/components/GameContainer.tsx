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

const paddleHeight = 100;
const canvasHeight = 600;

const drawGame = (gameState: GameState) => (ctx: CanvasRenderingContext2D) => {
  if (!gameState) return;

  // Clear canvas
  ctx.clearRect(0, 0, 800, 600);

  // Draw ball
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Draw paddles and scores
  const playerIds = Object.keys(gameState.players);
  if (playerIds.length >= 2) {
    const leftPlayer = gameState.players[playerIds[0]];
    const rightPlayer = gameState.players[playerIds[1]];

    ctx.fillRect(0, leftPlayer.paddleY, 10, paddleHeight);
    ctx.fillRect(800 - 10, rightPlayer.paddleY, 10, paddleHeight);

    ctx.font = '30px Arial';
    ctx.fillText(String(leftPlayer.score), 300, 50);
    ctx.fillText(String(rightPlayer.score), 500, 50);
  }
};

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [paddleY, setPaddleY] = useState(250); // initial paddle position
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [inGame, setInGame] = useState<boolean>(true);

  // Listen to server events
  useEffect(() => {
    socket.on('gameStateUpdate', (state: GameState) => {
      setGameState(state);
      setInGame(true);
      setWinnerId(null);
    });

    socket.on('gameOver', (winner: string) => {
      setWinnerId(winner);
    });

    socket.on('opponentLeft', () => {
      setInGame(false);
      setGameState(null);
      setWinnerId(null);
    });

    return () => {
      socket.off('gameStateUpdate');
      socket.off('gameOver');
      socket.off('opponentLeft');
    };
  }, []);

  // Handle paddle movement keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPaddleY((prev) => {
        let newY = prev;
        if (e.key === 'ArrowUp') newY = Math.max(0, prev - 10);
        else if (e.key === 'ArrowDown') newY = Math.min(canvasHeight - paddleHeight, prev + 10);

        socket.emit('paddleMove', { position: newY });
        return newY;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!inGame) {
    return (
      <div style={{ marginLeft: '300px' }}>
        <h2>Waiting for game to start...</h2>
      </div>
    );
  }

  // Map winner id to "First Player" or "Second Player"
  let winnerLabel = '';
  if (winnerId && gameState) {
    const playerIds = Object.keys(gameState.players);
    if (playerIds[0] === winnerId) winnerLabel = 'First Player';
    else if (playerIds[1] === winnerId) winnerLabel = 'Second Player';
    else winnerLabel = 'Unknown Player';
  }

  return (
    <div style={{ position: 'relative' }}>
      {gameState ? (
        <GameCanvas draw={drawGame(gameState)} />
      ) : (
        <div style={{ marginLeft: '300px' }}> <h2>Waiting for game to start...</h2></div>
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
          {winnerLabel} wins!
        </div>
      )}
    </div>
  );
};

export default GameContainer;
