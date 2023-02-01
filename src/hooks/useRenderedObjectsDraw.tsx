import { renderedObjectsIntance, useCanvasCtx } from '@/store';

export const useRenderedObjectsDraw = () => {
  const ctx = useCanvasCtx();

  const beginDraw = () => {
    if (!ctx) return;
    ctx.beginPath();

    for (const node of renderedObjectsIntance) {
      if (!node.value) return;
      node.value.draw(ctx);
    }
  };

  return [beginDraw];
};
