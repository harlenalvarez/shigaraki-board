import { useSetCanvasCtx } from '@/store';
import { canvasTransform } from '@/store/Canvas2dContextNonReact';
import { useEventProducer } from '@practicaljs/react-eventchannel';
import { useCallback, useLayoutEffect, useRef } from 'react';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCtx = useSetCanvasCtx();
  const [redraw] = useEventProducer({ eventName: 'onRedraw' });

  const createCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const height = window.innerHeight;
    const width = window.innerWidth;
    canvasRef.current.height = height * window.devicePixelRatio;
    canvasRef.current.width = width * window.devicePixelRatio;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    ctx.setTransform(canvasTransform.scale, 0, 0, canvasTransform.scale, canvasTransform.offset.x, canvasTransform.offset.y);
    ctx.save();
    setCtx(ctx);
    redraw();
  }, []);

  useLayoutEffect(() => {
    createCanvas();
    document.addEventListener('resize', createCanvas)
    return () => {
      document.addEventListener('resize', createCanvas)
    }
  }, []);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};
