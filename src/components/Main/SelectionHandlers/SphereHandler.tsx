import { useRenderedObjectsDraw } from '@/hooks/useRenderedObjectsDraw';
import { RenderedObjects, renderedObjectsIntance, useCanvasCtx } from '@/store';
import { CanvasNode, isType, Text2D } from '@/types';
import { Node2D } from '@/types/canvas-shapes/Node2D';
import { CanvasNodeConnPosition } from '@/types/Shapes';
import { clearCanvas, getClickedPoint, getConnectionPoints, getMidPoint, getNodeAttachentPoints, getSlope } from '@/utils';
import { ActionListenerContainer } from '../Main.styled';

export const SphereHandler = () => {
  const ctx = useCanvasCtx();
  const renderedText = new RenderedObjects();
  const [drawCanvas] = useRenderedObjectsDraw(renderedObjectsIntance);
  const [drawText] = useRenderedObjectsDraw(renderedText);

  const handleClick = (e: React.MouseEvent) => {
    if (ctx == null) return;
    e.preventDefault();
    e.stopPropagation();
    ctx.lineWidth = 1;
    ctx.save();

    ctx.restore();
    ctx.beginPath();
    renderedObjectsIntance.clear();
    renderedText.clear();
    const [currentX, currentY] = getClickedPoint(e, ctx.canvas);
    // create the first sphere
    const sphere = new Node2D({ radius: 75, point: { x: currentX, y: currentY } });
    const nodeText = new Text2D({ value: 'I am a node', point: { x: currentX, y: currentY }, color: 'white', alignment: 'center', baseline: 'middle' });

    renderedObjectsIntance.push(sphere);
    renderedText.push(nodeText);
    const { width: cWidth, height: cHeight } = ctx.canvas.getBoundingClientRect();
    for (let index = 0; index < 10; index++) {
      const x = (Math.random() * cWidth);
      const y = (Math.random() * cHeight);
      const sphere = new Node2D({ radius: 25, point: { x, y } });
      const nodeText = new Text2D({ value: `${index + 1}`, point: { x, y }, color: 'white', alignment: 'center', baseline: 'middle' });

      renderedObjectsIntance.push(sphere);
      renderedText.push(nodeText);
    }
    const time = performance.now();
    clearCanvas(ctx);
    // visualize the connection points of this sphere
    const points = getNodeAttachentPoints(sphere.point, sphere.radius, 5);
    for (const point of points) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // lets connect the two shapes
    const prevBeforeAdd = renderedObjectsIntance.head?.value;

    for (const prevObj of renderedObjectsIntance) {
      const prev = prevObj.value;

      if (prev === prevBeforeAdd) continue;
      if (!prevBeforeAdd || !prev) {
        drawCanvas();
        drawText();
        return;
      }

      if (isType<CanvasNode>(prevBeforeAdd, 'point', 'radius') && isType<CanvasNode>(prev, 'point', 'radius')) {
        const { nodeA, nodeB } = getConnectionPoints(prevBeforeAdd, prev, 5);
        const midPoint = getMidPoint(prevBeforeAdd.point, prev.point);

        ctx.beginPath();
        ctx.moveTo(nodeA.point.x, nodeA.point.y);
        // we want to move toward the midPoint with a quadratic curve
        // if bottom or top start with nodes
        let radius = 30;
        const slope = getSlope(nodeA.point, midPoint, radius * 2);
        if (!slope) {
          ctx.lineTo(nodeB.point.x, nodeB.point.y);
        } else if (nodeA.position & (CanvasNodeConnPosition.top | CanvasNodeConnPosition.bottom)) {
          if (slope > -0.2 && slope < 0.2) {
            radius = 3;
          }
          ctx.arcTo(nodeA.point.x, midPoint.y, midPoint.x, midPoint.y, radius);
          ctx.arcTo(nodeB.point.x, midPoint.y, nodeB.point.x, nodeB.point.y, radius);
          ctx.lineTo(nodeB.point.x, nodeB.point.y);
        } else {
          if (slope > -0.2 && slope < 0.2) {
            //   ctx.quadraticCurveTo(midPoint.x, nodeA.point.y, midPoint.x, midPoint.y);
            //   ctx.quadraticCurveTo(midPoint.x, nodeB.point.y, nodeB.point.x, nodeB.point.y);
            radius = 3;
          }

          ctx.arcTo(midPoint.x, nodeA.point.y, midPoint.x, midPoint.y, radius);
          ctx.arcTo(midPoint.x, nodeB.point.y, nodeB.point.x, nodeB.point.y, radius);
          ctx.lineTo(nodeB.point.x, nodeB.point.y);
        }

        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
    drawCanvas();
    drawText();
    const end = performance.now();
    console.log(end - time);
  };
  return (
    <ActionListenerContainer onClick={handleClick}></ActionListenerContainer>
  );
};
