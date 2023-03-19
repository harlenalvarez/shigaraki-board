import { fromAlphaToHex, type Need, type Point } from '@practicaljs/canvas-kit';

export interface ICanvasComponent {
  id: string;
  point: Point;
  draw: (ctx: CanvasRenderingContext2D) => void;
  toByteArray: () => Uint8Array;
  setOpacity: (opacity: string | number) => void;
  toJson: () => object
}

export abstract class ShapesBase {
  encoder: TextEncoder = new TextEncoder();
  id: string
  point: Point;
  alpha: string = 'FF';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;

  constructor(props: Need<ShapesBase, 'point'>) {
    this.point = props.point;
    this.fillColor = props.fillColor;
    this.strokeColor = props.strokeColor;
    this.strokeWidth = props.strokeWidth;
    this.alpha = props.alpha ?? 'FF';
    this.id = crypto.randomUUID()
    this.toJson = this.toJson.bind(this);
  }

  toJson() {
    return {
      id: this.id,
      point: this.point,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      alpha: this.alpha,
      strokeWidth: this.strokeWidth
    };
  }

  draw(_: CanvasRenderingContext2D) {
    throw new Error('Draw method was not implmented');
  }

  setOpacity(opacity: string | number) {
    if (opacity === null || opacity === undefined) return;
    if (typeof opacity === 'string') {
      this.alpha = opacity;
      return;
    }
    this.alpha = fromAlphaToHex(opacity)
  }
}
