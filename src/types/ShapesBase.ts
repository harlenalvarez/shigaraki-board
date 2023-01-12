import { Colors } from '@/store';
import { RGBA } from './DrawContext';
import { Need } from './reducer';
import { Point } from './Shapes';

export class ShapesBase {
  point: Point
  private _color?: string
  get color(): string {
    if (!this._color) {
      throw new Error('color not set');
    }
    return this.color;
  }
  set color(value: string | RGBA) {
    if (value instanceof Array) {
      this._color = `rgba(${value.join(',')})`;
    }
    else {
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
    }
    else if (value) {
      this._strokeColor = value;
    }
  }

  constructor(props: Need<ShapesBase, 'point'>) {
    this.point = props.point;
    this.color = props.color ?? Colors.TextDark;
    this.strokeColor = props.strokeColor;
  }
}