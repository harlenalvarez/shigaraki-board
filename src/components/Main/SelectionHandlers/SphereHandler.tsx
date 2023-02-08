import { useRenderedObjectsDraw } from '@/hooks/useRenderedObjectsDraw';
import { RenderedObjects, renderedObjectsIntance, useCanvasCtx } from '@/store';
import { isType, ShapesBase } from '@/types';
import { Node2D } from '@/types/canvas-shapes/Node2D';
import { CanvasNodeConnPosition } from '@/types/Shapes';
import { clearCanvas, getCanvasPoint, getConnectionPoints, getMidPoint, getSlope, nodeArcAutoPosition, NodeSection } from '@/utils';
import { useEffect, useState } from 'react';
import { ActionListenerContainer } from '../Main.styled';

function connectAndRender(ctx: CanvasRenderingContext2D, drawCanvas: () => void, drawText: () => void, hover: boolean): void {

  const time = performance.now();
  clearCanvas(ctx);

  // lets connect the two shapes
  const prevBeforeAdd = renderedObjectsIntance.head?.value;
  if (hover) {
    for (const prevObj of renderedObjectsIntance) {
      const prev = prevObj.value;
      if (prev === prevBeforeAdd) continue;
      if (!prevBeforeAdd || !prev) {
        drawCanvas();
        drawText();
        return;
      }

      if (isType<Node2D>(prevBeforeAdd, 'point', 'radius', 'text') && isType<Node2D>(prev, 'point', 'radius', 'text')) {
        if (!isNaN(Number(prev.text)) && Number(prev.text) % 2 === 0 && hover) continue;
        const { nodeA, nodeB } = getConnectionPoints(prevBeforeAdd, prev, 10);
        const midPoint = getMidPoint(nodeA.point, nodeB.point);
        ctx.beginPath();
        ctx.moveTo(nodeA.point.x, nodeA.point.y);

        // we want to move toward the midPoint with a quadratic curve
        // if bottom or top start with nodes
        let radius = 30;
        const slope = getSlope(nodeA.point, nodeB.point, radius * 2);

        if (!slope) {
          ctx.lineTo(nodeB.point.x, nodeB.point.y);
        }
        else if (nodeA.position & (CanvasNodeConnPosition.top | CanvasNodeConnPosition.bottom)) {
          if (slope > -0.2 && slope < 0.2) {
            radius = 3;
          }
          ctx.arcTo(nodeA.point.x, midPoint.y, midPoint.x, midPoint.y, radius);
          ctx.arcTo(nodeB.point.x, midPoint.y, nodeB.point.x, nodeB.point.y, radius);
          ctx.lineTo(nodeB.point.x, nodeB.point.y);
        }
        else {
          if (slope > -0.2 && slope < 0.2) {
            //   ctx.quadraticCurveTo(midPoint.x, nodeA.point.y, midPoint.x, midPoint.y);
            //   ctx.quadraticCurveTo(midPoint.x, nodeB.point.y, nodeB.point.x, nodeB.point.y);
            radius = 3;
          }

          ctx.arcTo(midPoint.x, nodeA.point.y, midPoint.x, midPoint.y, radius);
          ctx.arcTo(midPoint.x, nodeB.point.y, nodeB.point.x, nodeB.point.y, radius);
          ctx.lineTo(nodeB.point.x, nodeB.point.y);
        }
        prev.color = [221, 211, 211, 0.5];
        prev.fontColor = 'rgba(255, 255, 255, 0.5)';
        ctx.fillStyle = 'rgba(221,221,221, 0.5)';
        ctx.strokeStyle = 'rgba(221,221,221, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();

      }
    }
  }

  for (const prevObj of renderedObjectsIntance) {
    const prev = prevObj.value;
    if (prev === prevBeforeAdd) continue;
    if (!prevBeforeAdd || !prev) {
      drawCanvas();
      drawText();
      return;
    }

    if (isType<Node2D>(prevBeforeAdd, 'point', 'radius', 'text') && isType<Node2D>(prev, 'point', 'radius', 'text')) {
      if (isNaN(Number(prev.text)) || Number(prev.text) % 2 > 0 && hover) continue;
      const { nodeA, nodeB } = getConnectionPoints(prevBeforeAdd, prev, 10);
      const midPoint = getMidPoint(nodeA.point, nodeB.point);
      ctx.beginPath();
      ctx.moveTo(nodeA.point.x, nodeA.point.y);

      // filter by evens


      // we want to move toward the midPoint with a quadratic curve
      // if bottom or top start with nodes
      let radius = 30;
      const slope = getSlope(nodeA.point, nodeB.point, radius * 2);

      if (!slope) {
        ctx.lineTo(nodeB.point.x, nodeB.point.y);
      }
      else if (nodeA.position & (CanvasNodeConnPosition.top | CanvasNodeConnPosition.bottom)) {
        if (slope > -0.2 && slope < 0.2) {
          radius = 3;
        }
        ctx.arcTo(nodeA.point.x, midPoint.y, midPoint.x, midPoint.y, radius);
        ctx.arcTo(nodeB.point.x, midPoint.y, nodeB.point.x, nodeB.point.y, radius);
        ctx.lineTo(nodeB.point.x, nodeB.point.y);
      }
      else {
        if (slope > -0.2 && slope < 0.2) {
          //   ctx.quadraticCurveTo(midPoint.x, nodeA.point.y, midPoint.x, midPoint.y);
          //   ctx.quadraticCurveTo(midPoint.x, nodeB.point.y, nodeB.point.x, nodeB.point.y);
          radius = 3;
        }

        ctx.arcTo(midPoint.x, nodeA.point.y, midPoint.x, midPoint.y, radius);
        ctx.arcTo(midPoint.x, nodeB.point.y, nodeB.point.x, nodeB.point.y, radius);
        ctx.lineTo(nodeB.point.x, nodeB.point.y);
      }
      prev.color = prevBeforeAdd.color;
      prev.fontColor = prevBeforeAdd.fontColor;
      ctx.strokeStyle = '#555';
      ctx.fillStyle = '#555';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
    }
  }

  drawCanvas();
  drawText();
  const end = performance.now();
  console.log(end - time);
}

export const SphereHandler = () => {
  const ctx = useCanvasCtx();
  const renderedText = new RenderedObjects();
  const [drawCanvas] = useRenderedObjectsDraw(renderedObjectsIntance);
  const [drawText] = useRenderedObjectsDraw(renderedText);
  const [hoveringNode, setHoveringNode] = useState<ShapesBase>({} as ShapesBase)

  useEffect(() => {
    if (!ctx) return;
    if (isType<Node2D>(hoveringNode, 'radius', 'point')) {
      connectAndRender(ctx, drawCanvas, drawText, true);
    }
    else {
      connectAndRender(ctx, drawCanvas, drawText, false);
    }
  }, [hoveringNode, ctx])
  const handleClick = (e: React.MouseEvent) => {
    if (ctx == null) return;
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.save();
    e.preventDefault();
    e.stopPropagation();
    ctx.lineWidth = 1;
    ctx.save();

    ctx.restore();
    ctx.beginPath();
    renderedObjectsIntance.clear();
    renderedText.clear();
    const [currentX, currentY] = getCanvasPoint(e, ctx);
    // create the first sphere
    const pointRadius = 101;
    const sphere = new Node2D({ radius: pointRadius, point: { x: currentX, y: currentY }, color: '#ccc', text: 'Simplify', fontColor: '#333943', strokeColor: '#FFF', progress: 50 });
    const level1NodeRadius = 86;
    const { positionNode } = nodeArcAutoPosition({ center: sphere.point, centerRadius: sphere.radius, nodesCount: 10, nodesRadius: level1NodeRadius, startAngle: 45, section: NodeSection.full });
    renderedObjectsIntance.push(sphere);
    for (let index = 0; index < 10; index++) {
      const { x, y } = positionNode(index);
      const sphere = new Node2D({ radius: level1NodeRadius, point: { x, y }, color: '#ccc', text: `${index + 1}`, fontColor: '#333943', progress: Math.floor(Math.random() * 101) });
      renderedObjectsIntance.push(sphere);
    }
    connectAndRender(ctx, drawCanvas, drawText, false);
  };

  const checkHover = (e: React.MouseEvent) => {
    if (!ctx || !renderedObjectsIntance.head) return;
    if (!isType<Node2D>(renderedObjectsIntance.head.value, 'radius', 'point')) return;
    const [x, y] = getCanvasPoint(e, ctx, true);
    if (ctx.isPointInPath(renderedObjectsIntance.head.value.path, x, y)) {
      if (hoveringNode !== renderedObjectsIntance.head.value)
        setHoveringNode(renderedObjectsIntance.head.value)
    }
    else if (isType<Node2D>(hoveringNode, 'radius', 'point')) {
      setHoveringNode({} as ShapesBase);
    }
  };

  return (
    <ActionListenerContainer onClick={handleClick} onMouseMove={checkHover}></ActionListenerContainer>
  );
};
