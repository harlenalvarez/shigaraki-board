import { CanvasNode, Optional, Point } from '@/types';
import { CanvasNodeConnections, CanvasNodeConnPosition } from '@/types/Shapes';

export const getClickedPoint = (e: { clientX: number, clientY: number }, canvas?: HTMLCanvasElement): [number, number] => {
  if (canvas == null) throw new Error('Canvas argument is undefined');
  const { left, top } = canvas.getBoundingClientRect();
  return [
    e.clientX - left,
    e.clientY - top
  ];
};

export const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  const { width, height } = ctx.canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, width, height);
};

export const getMidPoint = (point1: Point, point2: Point): Point => {
  return { x: (point1.x + point2.x) / 2, y: (point1.y + point2.y) / 2 };
};

export const getSlope = (point1: Point, point2: Point, margin: number = 1) => {
  if (Math.abs(point1.x - point2.x) < margin) return 0;
  const slope = (point2.y - point1.y) / (point2.x - point1.x);
  return Math.round((slope + Number.EPSILON) * 10) / 10;
};

export const getDistance = (point1: Point, point2: Point): number => {
  const squared = Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2);
  const sqroot = Math.sqrt(squared);
  // this round is not 100% accurate, but for what we're using it it's completly fine ( do not ever use this for accuracy or money transactions)
  const decimalDistance = Math.round((sqroot + Number.EPSILON) * 100) / 100;
  return decimalDistance;
};

// Normally we would use cos sin to get the edge at x, y, but we're not connecting directly to the circle ( there is a gap)
// so I figure it will be less intensive to simply get the points by just using the radius with a gap
export const getNodeAttachentPoints = (point: Point, radius: number, gap: number = 0): Point[] => {
  const gapRadius = radius + gap;
  //const top = { x: point.x + gapRadius * Math.cos(Math.PI * 1.5), y: point.y + gapRadius * Math.sin(Math.PI * 1.5) };
  const top = { x: point.x, y: point.y - gapRadius };
  const right = { x: point.x + gapRadius, y: point.y };
  const bottom = { x: point.x, y: point.y + gapRadius };
  const left = { x: point.x - gapRadius, y: point.y };

  return [top, right, bottom, left];
};

const positionMap = {
  0: CanvasNodeConnPosition.top,
  1: CanvasNodeConnPosition.right,
  2: CanvasNodeConnPosition.bottom,
  3: CanvasNodeConnPosition.left
};

const findClosestPoint = (nodePoints: Point[], midPoint: Point): { point: Point, position: CanvasNodeConnPosition } => {
  let closestPoint: [Point, number, number] = [{ x: 0, y: 0 }, Number.MAX_SAFE_INTEGER, -1];
  // no more then 4 points per node
  for (let x = 0; x < 4; x++) {
    const point = nodePoints[x];
    const distance = getDistance(midPoint, point);
    if (distance < closestPoint[1]) {
      closestPoint = [point, distance, x];
    }
  }
  const index = closestPoint[2] as keyof typeof positionMap;
  return { point: closestPoint[0], position: positionMap[`${index}`] };
};

export const getConnectionPoints = (nodeA: CanvasNode, nodeB: CanvasNode, gap: number = 0): CanvasNodeConnections => {
  const midPoint = getMidPoint(nodeA.point, nodeB.point);
  const nodeAPoints = getNodeAttachentPoints(nodeA.point, nodeA.radius, gap);
  const nodeBPoints = getNodeAttachentPoints(nodeB.point, nodeB.radius, gap);

  const nodeAConnection = findClosestPoint(nodeAPoints, midPoint);
  const nodeBConnection = findClosestPoint(nodeBPoints, midPoint);
  return { nodeA: nodeAConnection, nodeB: nodeBConnection };
};
export enum NodeSection {
  oneFourth = 1.5,
  half = 2,
  threeFourth = 1.5,
  full = 1
}
export type nodeArcAutoPositionProps = {
  center: Point,
  centerRadius: number,
  nodesRadius: number,
  nodesCount: number,
  startAngle: number,
  gap: number,
  section: NodeSection
}
/**
 * Given point, a node radius size and node amount, it will return a method to that generates a nodes in a circle
 */
export const nodeArcAutoPosition = ({ center, centerRadius, nodesRadius, nodesCount, startAngle = 0, gap = 10, section = NodeSection.full }: Optional<nodeArcAutoPositionProps, 'startAngle' | 'gap' | 'section'>) => {
  const nodesSectionCount = nodesCount * section;
  if (nodesSectionCount < 1) { throw new Error('Node Arc Auto Poisition did not recieved a node count'); }

  const diameterOfEachNode = nodesRadius * 2 + gap;
  const neededCircumference = diameterOfEachNode * nodesSectionCount;
  const lvlRadius = (neededCircumference / (2 * Math.PI)) * 1.3;
  const offsetAngle = startAngle - 90;
  const levelRadius = centerRadius + lvlRadius; //
  const placementRadius = (lvlRadius / 1.3) + centerRadius;

  let sectionCircumference = neededCircumference;
  if (section != NodeSection.full) {
    sectionCircumference = ((0.5 * Math.PI) / (2 * Math.PI)) * neededCircumference;
  }
  const angleStep = (diameterOfEachNode / neededCircumference) * 360;

  function positionNode(index: number): Point {
    const radiansAngle = (index * angleStep + offsetAngle) * (Math.PI / 180)
    const x = Math.cos(radiansAngle) * placementRadius + center.x;
    const y = Math.sin(radiansAngle) * placementRadius + center.y;
    return { x, y };
  }
  return { levelRadius, placementRadius, positionNode }
}


// 90/360 = x/circumference
// .5PI/2PI = x/circum
// (0.5PI/2PI) * circm = x
// x/360 = nodeDia/circumference
// x = (nodeDia/circumference)*360

// 10 = 1.3 20 = x
// 1.3 * 20 = 10x
// 2.6 = 10x
// 2.6/10 = x
