import React, { useRef, useEffect } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface GameCanvasProps {
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ draw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const windowRatio = window.innerWidth / window.innerHeight;
      const gameRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

      if (windowRatio < gameRatio) {
        // Window is narrower than game — scale by width
        const scale = window.innerWidth / CANVAS_WIDTH;
        canvas.style.width = `${(CANVAS_WIDTH * scale)-20}px`;
        canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
      } else {
        // Window is wider than game — scale by height
        const scale = window.innerHeight / CANVAS_HEIGHT;
        canvas.style.width = `${CANVAS_WIDTH * scale}px`;
        canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      draw(ctx);
      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ display: 'block', margin: '0 auto', backgroundColor: '#000', border: '2px solid black' }}
    />
  );
};

export default GameCanvas;
