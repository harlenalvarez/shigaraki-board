import { useSetCanvasCtx } from '@/store';
import { useEventProducer } from '@practicaljs/react-eventchannel';
import { useCallback, useLayoutEffect, useRef } from 'react';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCtx = useSetCanvasCtx();
  const [redraw] = useEventProducer({ eventName: 'onRedraw' });

  useLayoutEffect(() => {
    handleSetCurrentHeight();
    // handleStyledSize();
  }, []);

  const handleSetCurrentHeight = useCallback((e?: { clientX: number, clientY: number }) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const ratio = Math.ceil(window.devicePixelRatio);
    const height = Math.max(window.innerHeight, 1600);
    const width = Math.max(window.innerWidth, 1600);
    canvasRef.current.height = height * ratio;
    canvasRef.current.width = width * ratio;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    setCtx(ctx);
    redraw();
  }, []);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};
