import { RenderedObjects, useCanvasCtx } from '@/store';

export const useRenderedObjectsDraw = (objects: RenderedObjects) => {
  const ctx = useCanvasCtx();

  const beginDraw = () => {
    if (!ctx) return;
    ctx.restore();
    ctx.beginPath();

    for (const node of objects) {
      if (!node.value) return;
      node.value.draw(ctx);
    }
  };

  return [beginDraw];
};
