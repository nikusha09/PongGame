import React, { useEffect, useState } from 'react';
import socket from '../socket';

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.on('roomAssigned', ({ room, players }) => {
      console.log('Assigned to room:', room, players);
    });

    socket.on('gameStateUpdate', (state) => {
      setGameState(state);
    });

    socket.on('gameOver', (winner) => {
      setGameOver(true);
      alert(`Game Over! Winner: ${winner}`);
    });

    return () => {
      socket.off('roomAssigned');
      socket.off('gameStateUpdate');
      socket.off('gameOver');
    };
  }, []);

  const handlePaddleMove = (newPosition: number) => {
    socket.emit('paddleMove', { position: newPosition });
  };

  return (
    <div>
      <h2>Game Area</h2>
      <button onClick={() => handlePaddleMove(100)}>Move Paddle to 100</button>
      {gameOver && <div>Game Over!</div>}
    </div>
  );
};

export default Game;
