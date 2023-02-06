export type Point = {
  x: number
  y: number
};

export type CanvasNode = {
  point: Point
  radius: number
}

export enum CanvasNodeConnPosition {
  top = 0b1,
  right = 0b10,
  bottom = 0b100,
  left = 0b1000
}
export type CanvasNodeConnections = {
  nodeA: { point: Point, position: CanvasNodeConnPosition },
  nodeB: { point: Point, position: CanvasNodeConnPosition }
}