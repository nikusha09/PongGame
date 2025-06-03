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

    // Resize canvas to fill parent width, keep aspect ratio
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const parentWidth = parent.clientWidth;
      const scale = parentWidth / CANVAS_WIDTH;
      canvas.style.width = `${CANVAS_WIDTH * scale}px`;
      canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    draw(ctx);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ border: '2px solid black', backgroundColor: '#000' }}
    />
  );
};

export default GameCanvas;
