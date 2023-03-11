import { ScaleContext } from '@/components/Zoom';
import { useRenderedObjectsDraw } from '@/hooks/useRenderedObjectsDraw';
import { RenderedObjects, renderedObjectsIntance, useCanvasCtx } from '@/store';
import { isType, type ShapesBase } from '@/types';
import { Node2D } from '@/types/canvas-shapes/Node2D';
import { clearCanvas, connectNodesWithCurvedLine, connectNodesWithStraightLine, EdgeConnectionType, getCanvasPoint, getNodeAttachentPoints, nodeRadialPosition, NodeSection } from '@practicaljs/canvas-kit';
import { useEventSubscriber } from '@practicaljs/react-eventchannel';
import { useContext, useEffect, useState } from 'react';
import { ActionListenerContainer } from '../Main.styled';

function connectAndRender(ctx: CanvasRenderingContext2D, drawCanvas: () => void, drawText: () => void, edgeType: EdgeConnectionType, hover: boolean): void {
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
        prev.color = [221, 211, 211, 0.5];
        prev.fontColor = 'rgba(255, 255, 255, 0.5)';
        ctx.fillStyle = 'rgba(221,221,221, 0.5)';
        ctx.strokeStyle = 'rgba(221,221,221, 0.5)';
        ctx.lineWidth = 2;
        if (edgeType & EdgeConnectionType.curved) { connectNodesWithCurvedLine(prevBeforeAdd, prev, ctx, 0, 8); } else { connectNodesWithStraightLine(prevBeforeAdd, prev, ctx); }
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
      if ((isNaN(Number(prev.text)) || Number(prev.text) % 2 > 0) && hover) continue;
      prev.color = prevBeforeAdd.color;
      prev.fontColor = prevBeforeAdd.fontColor;
      ctx.strokeStyle = '#555';
      ctx.fillStyle = '#555';
      ctx.lineWidth = 2;
      if (edgeType & EdgeConnectionType.curved) { connectNodesWithCurvedLine(prevBeforeAdd, prev, ctx, 0, 8); } else { connectNodesWithStraightLine(prevBeforeAdd, prev, ctx); }
      ctx.stroke();
      ctx.beginPath();
    }
  }

  let parent = renderedObjectsIntance.head?.next;
  let child = level2Objs.head;
  for (let lvlIndex = 0; lvlIndex < level2Objs.length; lvlIndex++) {
    if (!parent || !child) continue;
    if (isType<Node2D>(parent.value, 'point', 'radius', 'text') && isType<Node2D>(child.value, 'point', 'radius', 'text')) {
      child.value.color = parent.value.rgbaColor ?? parent.value.color;
      child.value.fontColor = parent.value.fontColor;
      if (edgeType & EdgeConnectionType.curved) { connectNodesWithCurvedLine(parent.value, child.value, ctx, 0, 8); } else { connectNodesWithStraightLine(parent.value, child.value, ctx); }

      if (!parent.value.rgbaColor) {
        ctx.strokeStyle = '#555';
        ctx.fillStyle = '#555';
      } else {
        ctx.fillStyle = 'rgba(221,221,221, 0.5)';
        ctx.strokeStyle = 'rgba(221,221,221, 0.5)';
      }
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
    }
    if ((lvlIndex + 1) % 2 === 0 && lvlIndex !== 0) {
      parent = parent.next;
    }
    child = child.next;
  }

  drawCanvas();
  drawText();
  const end = performance.now();
}

const level2Objs = new RenderedObjects();

export const SphereHandler = () => {
  const ctx = useCanvasCtx();
  const renderedText = new RenderedObjects();
  const scale = useContext(ScaleContext);
  console.log(scale);
  // this is bad, will need to create a RenderedObjects structure that is in tree format so we can BFS

  const [drawRoot] = useRenderedObjectsDraw(renderedObjectsIntance);
  const [drawLvl2] = useRenderedObjectsDraw(level2Objs);
  const [drawText] = useRenderedObjectsDraw(renderedText);
  const [hoveringNode, setHoveringNode] = useState<ShapesBase>({} as ShapesBase);
  const [nodeCount, setNodeCount] = useState(10);
  const [connectionType, setConnectionType] = useState<EdgeConnectionType>(EdgeConnectionType.curved);

  const handleRedraw = () => {
    if (!ctx) return;
    connectAndRender(ctx, drawCanvas, drawText, connectionType, false);
  };

  useEventSubscriber({
    onRedraw: handleRedraw
  }, [ctx]);

  const drawCanvas = () => {
    drawRoot();
    drawLvl2();
  };

  useEffect(() => {
    if (!ctx) return;
    if (isType<Node2D>(hoveringNode, 'radius', 'point')) {
      connectAndRender(ctx, drawCanvas, drawText, connectionType, true);
    } else {
      connectAndRender(ctx, drawCanvas, drawText, connectionType, false);
    }
  }, [hoveringNode, ctx]);

  useEffect(() => {
    console.log('scale', scale);
    if (scale === 1) return;
    for (const node of renderedObjectsIntance) {
      if (isType(node.value, 'setScale')) {
        node.value.setScale(scale);
      }
    }
    for (const node of level2Objs) {
      if (isType(node.value, 'setScale')) {
        node.value.setScale(scale);
      }
    }
    console.log('redrawing after scale change');
    handleRedraw();
  }, [scale]);

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
    level2Objs.clear();
    const [currentX, currentY] = getCanvasPoint(e, ctx);
    // create the first sphere
    const pointRadius = 101;
    const sphere = new Node2D({ radius: pointRadius, point: { x: currentX, y: currentY }, color: '#ccc', text: 'Simplify', fontColor: '#333943', strokeColor: '#FFF', progress: 50 });
    const level1NodeRadius = 86;
    const level2NodeRadius = 70;

    const sAngle = Math.floor(Math.random() * 365);
    const [positionNode, level1Radius, l1NodeRadius] = nodeRadialPosition({ center: sphere.point, centerRadius: sphere.radius, nodesCount: nodeCount, nodesRadius: level1NodeRadius, startAngle: sAngle, section: NodeSection.full });
    const [position2Node, level2Radius] = nodeRadialPosition({ center: sphere.point, centerRadius: l1NodeRadius, nodesCount: nodeCount * 2, nodesRadius: level2NodeRadius, startAngle: sAngle, section: NodeSection.full });

    // visualise node
    renderedObjectsIntance.push(sphere);
    for (let index = 0; index < nodeCount; index++) {
      const { x, y } = positionNode(index);
      const sphere = new Node2D({ radius: level1NodeRadius, point: { x, y }, color: '#ccc', text: `${index + 1}`, fontColor: '#333943', strokeColor: '#FFF', progress: Math.floor(Math.random() * 101) });
      renderedObjectsIntance.push(sphere);
    }

    for (let lvl2Index = 0; lvl2Index < nodeCount * 2; lvl2Index++) {
      const { x, y } = position2Node(lvl2Index);
      const sphere = new Node2D({ radius: level2NodeRadius, point: { x, y }, color: '#ccc', text: `${lvl2Index + 1}`, fontColor: '#333943', strokeColor: '#FFF', progress: Math.floor(Math.random() * 101) });
      level2Objs.push(sphere);
    }

    connectAndRender(ctx, drawCanvas, drawText, connectionType, false);

    ctx.restore();
    ctx.beginPath();

    const points = getNodeAttachentPoints(sphere.point, sphere.radius, 0, 8);

    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const checkHover = (e: React.MouseEvent) => {
    if (!ctx || !renderedObjectsIntance.head) return;
    if (!isType<Node2D>(renderedObjectsIntance.head.value, 'radius', 'point')) return;
    const [x, y] = getCanvasPoint(e, ctx, true);
    if (ctx.isPointInPath(renderedObjectsIntance.head.value.path, x, y)) {
      if (hoveringNode !== renderedObjectsIntance.head.value) { setHoveringNode(renderedObjectsIntance.head.value); }
    } else if (isType<Node2D>(hoveringNode, 'radius', 'point')) {
      setHoveringNode({} as ShapesBase);
    }
  };

  return (
    <>
      <label>NodeCount<input value={nodeCount} type='number' onChange={(e) => { setNodeCount(Number(e.currentTarget.value)); }} /></label>
      <label>Edge Type <select value={connectionType} onChange={(e) => { setConnectionType(Number(e.currentTarget.value)); }}><option value={EdgeConnectionType.straight}>Straight</option><option value={EdgeConnectionType.curved}>Curved</option></select></label>
      <ActionListenerContainer onClick={handleClick} onMouseMove={checkHover}></ActionListenerContainer>
    </>
  );
};
