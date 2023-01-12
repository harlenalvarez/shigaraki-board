import { Need } from './reducer';
import { ShapesBase } from './ShapesBase';

export class Box2D extends ShapesBase {

  width: number;
  height: number;
  radius: number;
  path: Path2D;
  constructor(props: Need<Box2D, 'width' | 'height' | 'point'>) {
    super(props)

    this.point = props.point;
    this.width = props.width;
    this.height = props.height;
    this.radius = props.radius ?? 4;

    this.path = new Path2D();

    if (!this.radius)
      this.path.rect(this.point.x, this.point.y, this.width, this.height);
    else
      this.path.roundRect(this.point.x, this.point.y, this.width, this.height, this.radius)
    this.draw = this.draw.bind(this);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.restore();
    ctx.beginPath();

    if (this.color) {
      ctx.fillStyle = this.color;
      ctx.fill(this.path);
    }

    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
      ctx.stroke(this.path);
    }
  }
}
