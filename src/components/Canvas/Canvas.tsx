import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  return (
    <>
      <canvas ref={canvasRef} width={width} height={height}></canvas>
    </>
  );
};
