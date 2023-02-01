import { useRenderedObjectsDraw } from '@/hooks/useRenderedObjectsDraw';
import { renderedObjectsIntance, useCanvasCtx } from '@/store';
import { Sphere2D } from '@/types/canvas-shapes/Sphere2D';
import { getClickedPoint, getNodeAttachentPoints } from '@/utils';
import { ActionListenerContainer } from '../Main.styled';

export const SphereHandler = () => {
  const ctx = useCanvasCtx();
  const [drawCanvas] = useRenderedObjectsDraw();

  const handleClick = (e: React.MouseEvent) => {
    if (ctx == null) return;
    e.preventDefault();
    e.stopPropagation();
    ctx.restore();
    ctx.beginPath();
    const [currentX, currentY] = getClickedPoint(e, ctx.canvas);

    const sphere = new Sphere2D({ radius: 100, point: { x: currentX, y: currentY } });
    renderedObjectsIntance.push(sphere);
    drawCanvas();

    // visualize the connection points of this sphere
    const points = getNodeAttachentPoints(sphere.point, sphere.radius);
    for (const point of points) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.stroke();
    }
    // lets connect the two shapes
    // const prevBeforeAdd = renderedObjectsIntance.tail?.prev?.value;
    // const prev = renderedObjectsIntance.tail?.value
    // if (!prevBeforeAdd || !prev) return;
    // ctx.beginPath();
    // ctx.moveTo(prevBeforeAdd.point.x, prevBeforeAdd.point.y);
  };
  return (
    <ActionListenerContainer onClick={handleClick}></ActionListenerContainer>
  );
};
