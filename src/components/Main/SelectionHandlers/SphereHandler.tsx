import { useRenderedObjectsDraw } from '@/hooks/useRenderedObjectsDraw';
import { renderedObjectsIntance, useCanvasCtx } from '@/store';
import { Sphere2D } from '@/types/canvas-shapes/Sphere2D';
import { getClickedPoint } from '@/utils';
import { ActionListenerContainer } from '../Main.styled';

export const SphereHandler = () => {
  const ctx = useCanvasCtx();
  const [drawCanvas] = useRenderedObjectsDraw();



  const handleClick = (e: React.MouseEvent) => {
    if (ctx == null) return;
    e.preventDefault();
    e.stopPropagation();
    ctx.resetTransform();
    ctx.beginPath();
    const [currentX, currentY] = getClickedPoint(e, ctx.canvas);

    const sphere = new Sphere2D({ radius: 100, point: { x: currentX, y: currentY } });
    renderedObjectsIntance.push(sphere);
    drawCanvas();

    // lets connect the two shapes
    const prevBeforeAdd = renderedObjectsIntance.tail?.prev?.value;
    const prev = renderedObjectsIntance.tail?.value
    if (!prevBeforeAdd || !prev) return;
    ctx.beginPath();
    ctx.moveTo(prevBeforeAdd.point.x, prevBeforeAdd.point.y);
    const midPoint = { x: (prevBeforeAdd.point.x + prev.point.x) / 2, y: (prevBeforeAdd.point.y + prev.point.y) / 2 };


    const firstCtrlPoint = { x: midPoint.x, y: prevBeforeAdd.point.y };
    const secondCtrlPoiunt = { x: prev.point.x, y: midPoint.y };

    // const firstCtrlPoint = { x: (prevBeforeAdd.point.x + midPoint.x) / 2, y: (prevBeforeAdd.point.y + midPoint.y) / 2 };
    // const secondCtrlPoiunt = { x: (midPoint.x + prev.point.x) / 2, y: (midPoint.y + prev.point.y) / 2 };
    //ctx.bezierCurveTo(firstCtrlPoint.x, firstCtrlPoint.y, secondCtrlPoiunt.x, secondCtrlPoiunt.y, prev.point.x, prev.point.y);
    ctx.strokeStyle = prevBeforeAdd.strokeColor || prevBeforeAdd.color;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(firstCtrlPoint.x, firstCtrlPoint.y, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(secondCtrlPoiunt.x, secondCtrlPoiunt.y, 5, 0, 2 * Math.PI);
    ctx.stroke();
  }
  return (
    <ActionListenerContainer onClick={handleClick}></ActionListenerContainer>
  );
}