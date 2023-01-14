import { Colors } from '@/store';
import { RGBA } from './DrawContext';
import { Need } from './reducer';
import { Point } from './Shapes';

export abstract class Serializable {
  abstract toByteArray: () => Uint8Array;
  static fromByteArray: (payload: Uint8Array) => unknown;
  static magicNumber: () => Uint8Array;
  static byteArrayIsTypeOf: (payload: Uint8Array) => boolean;
}

export class ShapesBase {
  encoder: TextEncoder = new TextEncoder();
  static decoder: TextDecoder = new TextDecoder();
  point: Point;
  private _color?: string;
  get color (): string {
    if (!this._color) {
      throw new Error('color not set');
    }
    return this._color;
  }

  set color (value: string | RGBA) {
    if (value instanceof Array) {
      this._color = `rgba(${value.join(',')})`;
    } else {
      this._color = value;
    }
  }

  private _strokeColor?: string;
  get strokeColor (): string | undefined {
    return this._strokeColor;
  }

  set strokeColor (value: string | RGBA | undefined) {
    if (value instanceof Array) {
      this._strokeColor = `rgba(${value.join(',')})`;
    } else if (value) {
      this._strokeColor = value;
    }
  }

  constructor (props: Need<ShapesBase, 'point'>) {
    this.point = props.point;
    this.color = props.color ?? Colors.TextDark;
    this.strokeColor = props.strokeColor;
    this.toJson = this.toJson.bind(this);
  }

  toJson () {
    return {
      point: this.point,
      color: this.color,
      strokeColor: this.strokeColor
    };
  }
}
