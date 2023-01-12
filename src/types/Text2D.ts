import { Colors } from '@/store'
import { Need } from './reducer'
import { ShapesBase } from './ShapesBase'

export class Text2D extends ShapesBase {
  value: string
  font: string
  alignment: 'start' | 'end' | 'left' | 'center' | 'right'
  baseline: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom'

  constructor(props: Need<Text2D, 'value' | 'point'>) {
    super(props)
    this.value = props.value;
    this.point = props.point;
    this.font = props.font ?? '20px Verdana';
    this.alignment = props.alignment ?? 'start';
    this.baseline = props.baseline ?? 'alphabetic';

    this.color = props.color ?? Colors.TextDark;
    this.strokeColor = props.strokeColor;
    this.draw = this.draw.bind(this);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.restore();
    ctx.beginPath();

    ctx.font = this.font;
    ctx.textAlign = this.alignment;
    ctx.textBaseline = this.baseline;
    ctx.fillStyle = this.color;

    if (this.color) {
      ctx.fillStyle = this.color;
      ctx.fillText(this.value, this.point.x, this.point.y);
    }

    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
      ctx.strokeText(this.value, this.point.x, this.point.y);
    }
  }
}
