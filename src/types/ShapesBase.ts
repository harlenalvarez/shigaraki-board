import { styleColors } from '@/store';
import { type Need, type Point } from '@practicaljs/canvas-kit';
import { type RGBA } from './DrawContext';

export abstract class Serializable {
  abstract toByteArray: () => Uint8Array;
  static fromByteArray: (payload: Uint8Array) => unknown;
  static magicNumber: () => Uint8Array;
  static byteArrayIsTypeOf: (payload: Uint8Array) => boolean;
  abstract setScale: (scale: number) => void;
}

export class ShapesBase {
  encoder: TextEncoder = new TextEncoder();
  static decoder: TextDecoder = new TextDecoder();
  point: Point;
  private _color?: string;
  rgbaColor?: RGBA;
  scale: number = 1;
  get color(): string {
    if (!this._color) {
      throw new Error('color not set');
    }
    return this._color;
  }

  set color(value: string | RGBA) {
    if (value instanceof Array) {
      this.rgbaColor = value;
      this._color = `rgba(${value.join(',')})`;
    } else {
      this.rgbaColor = undefined;
      this._color = value;
    }
  }

  private _strokeColor?: string;
  get strokeColor(): string | undefined {
    return this._strokeColor;
  }

  set strokeColor(value: string | RGBA | undefined) {
    if (value instanceof Array) {
      this._strokeColor = `rgba(${value.join(',')})`;
    } else if (value) {
      this._strokeColor = value;
    }
  }

  private readonly _strokeWidth?: number;
  get strokeWidth(): number | undefined {
    if (this._strokeWidth == null) return this._strokeWidth;
    return this._strokeWidth * this.scale;
  }

  set strokeWidth(value: number | undefined) {
    this.strokeWidth = value;
  }

  constructor(props: Need<ShapesBase, 'point'>) {
    this.point = props.point;
    this.color = props.color ?? styleColors.textDark;
    this.strokeColor = props.strokeColor;
    this.toJson = this.toJson.bind(this);
  }

  toJson() {
    return {
      point: this.point,
      color: this.color,
      strokeColor: this.strokeColor
    };
  }

  draw(_: CanvasRenderingContext2D) {
    throw new Error('Draw method was not implmented');
  }
}
