import { Point } from '@/types';

export const getClickedPoint = (e: { clientX: number, clientY: number }, canvas?: HTMLCanvasElement): [number, number] => {
  if (canvas == null) throw new Error('Canvas argument is undefined');
  const { left, top } = canvas.getBoundingClientRect();
  return [
    e.clientX - left,
    e.clientY - top
  ];
};

export const getMidPoint = (point1: Point, point2: Point): Point => {
  return { x: (point1.x + point2.x) / 2, y: (point1.y + point2.y) / 2 };
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
export const getNodeAttachentPoints = (point: Point, radius: number): Point[] => {
  const gapRadius = radius + 10;
  // const topWithTrig = { x: point.x + gapRadius * Math.cos(Math.PI * 1.5), y: point.y + gapRadius * Math.sin(Math.PI * 1.5) };
  const top = { x: point.x, y: point.y - gapRadius };
  const right = { x: point.x + gapRadius, y: point.y };
  const bottom = { x: point.x, y: point.y + gapRadius };
  const left = { x: point.x - gapRadius, y: point.y };

  return [top, right, bottom, left];
};
