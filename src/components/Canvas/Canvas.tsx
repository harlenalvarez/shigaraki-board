import { useSetCanvasCtx } from '@/store';
import { useCallback, useLayoutEffect, useRef } from 'react';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCtx = useSetCanvasCtx();

  useLayoutEffect(() => {
    handleSetCurrentHeight();
    // handleStyledSize();
  }, []);

  const handleSetCurrentHeight = useCallback(() => {
    if (canvasRef.current == null) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx == null) return;
    const ratio = Math.ceil(window.devicePixelRatio);
    const height = Math.max(window.innerHeight, 1600);
    const width = Math.max(window.innerWidth, 1600);
    const data = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.height = height * ratio;
    canvasRef.current.width = width * ratio;

    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;
    ctx.scale(ratio, ratio);
    ctx.putImageData(data, 0, 0);
    setCtx(ctx);
  }, []);

  // const handleStyledSize = useCallback(() => {
  //   if (canvasRef.current == null) return;
  //   canvasRef.current.style.height = `${window.innerHeight}px`;
  //   canvasRef.current.style.width = `${window.innerWidth}px`;
  // }, []);

  // useEffect(() => {
  //   const ctx = canvasRef.current?.getContext('2d');

  //   // window.addEventListener('resize', handleStyledSize);
  //   // return () => {
  //   //   window.removeEventListener('resize', handleStyledSize);
  //   // };
  // }, []);

  return (
    <>
      <canvas ref={canvasRef} ></canvas>
    </>
  );
};
