import { Point } from '@practicaljs/canvas-kit';

let listeners = new Set<() => void>();
let transformObject = {
  scale: 1,
  offset: { x: 0, y: 0 }
}

class CanvasTransform {
  private _scale: number = 1;
  private _offset: Point = { x: 0, y: 0 };

  get scale() {
    return this._scale;
  }

  set scale(value: number) {
    this._scale = value;
    listeners.forEach(l => l());
  }

  get offset() {
    return this._offset;
  }

  set offset(value: Point) {
    this._offset = { ...value };
    listeners.forEach(l => l());
  }

  subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    }
  }

  getSnapshot = () => {
    if (
      transformObject.scale !== this._scale ||
      transformObject.offset.x !== this._offset.x ||
      transformObject.offset.y !== this._offset.y
    ) {
      transformObject = { scale: this.scale, offset: this._offset }
    }

    return transformObject
  }
}

export const canvasTransform = new CanvasTransform()