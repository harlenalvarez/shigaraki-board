import { RenderedObjects } from '@/store';
import { type Need } from '@practicaljs/canvas-kit';
import { ShapesBase, type ICanvasComponent } from '../ShapesBase';
import { MagicNumbers } from './ShapesService';

export class Div2D extends ShapesBase implements ICanvasComponent {
  width: number;
  height: number;
  radius: number;
  path: Path2D;
  boxes: RenderedObjects = new RenderedObjects();
  constructor(props: Need<Div2D, 'width' | 'height' | 'point'>) {
    super(props);

    this.point = props.point;
    this.width = props.width;
    this.height = props.height;
    this.radius = props.radius ?? 4;

    this.path = new Path2D();

    if (this.radius === 0) { this.path.rect(this.point.x, this.point.y, this.width, this.height); } else { this.path.roundRect(this.point.x, this.point.y, this.width, this.height, this.radius); }
    this.draw = this.draw.bind(this);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.restore();
    ctx.beginPath();
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor + this.alpha;
      ctx.fill(this.path);
    }

    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor + this.alpha;
      ctx.stroke(this.path);
    }
  }

  toJson() {
    const baseJson = super.toJson();
    const fullJson = {
      ...baseJson,
      ...{
        width: this.width,
        height: this.height,
        radius: this.radius,
        point: this.point,
        boxes: [] as any[]
      }
    };
    for (const nextedBox of this.boxes) {
      if (nextedBox.value == null) continue;
      fullJson.boxes.push(nextedBox.value.toJson());
    }
    return fullJson;
  }

  toByteArray() {
    const json = this.toJson();
    const bytes = this.encoder.encode(JSON.stringify(json));
    const magicPrefix = new Uint8Array(MagicNumbers.box.length + bytes.length);
    magicPrefix.set(MagicNumbers.box);
    magicPrefix.set(bytes, MagicNumbers.box.length);
    return magicPrefix;
  }
}
