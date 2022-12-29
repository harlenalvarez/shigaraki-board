import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import style from './Canvas.module.css';
import { useSetCanvasCtx } from '@/store';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCtx = useSetCanvasCtx();

  const [[width, height], setDimentions] = useState([100, 100]);

  useLayoutEffect(() => {
    setDimentions([window.innerWidth, window.innerHeight]);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    setCtx(ctx);
  }, []);

  const handleCreate = (e: React.MouseEvent<HTMLDivElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx == null) return;
    const boundingRec = ctx.canvas.getBoundingClientRect();
    const x = e.clientX - boundingRec?.left ?? 0;
    const y = e.clientY - boundingRec?.top ?? 0;
    ctx.beginPath();
    ctx.fillStyle = '#262525';
    ctx.roundRect(x, y, 100, 100);
    ctx.fill();
  };

  return (
    <div onClick={handleCreate}>
      <canvas ref={canvasRef} className={style.canvas} width={width} height={height}></canvas>
    </div>
  );
};
