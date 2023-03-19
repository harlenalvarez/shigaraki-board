import { fromStringToMap, getContrast, serializeMapToString } from '@/utils';
import { FontStyle, getDistance, getNodeAttachentPoints, type Need } from '@practicaljs/canvas-kit';
import { ShapesBase, type ICanvasComponent } from '../ShapesBase';
import { MagicNumbers } from './ShapesService';
import { Text2D } from './Text2D';

export class Node2D extends ShapesBase implements ICanvasComponent {
  radius: number;
  path: Path2D;
  text: Map<string, FontStyle> = new Map();
  textColor?: string;
  textPath?: Text2D;

  constructor(props: Need<Node2D, 'radius' | 'point'>) {
    super(props);
    this.radius = props.radius;
    this.point = props.point;

    this.path = new Path2D();
    this.path.arc(this.point.x, this.point.y, this.radius, 0, 2 * Math.PI);
    if (props.text) {
      const text = typeof props.text === 'string' ? fromStringToMap<string, FontStyle>(props.text) : props.text;
      if (text?.size) {
        this.text = text;
        this.textColor = props.textColor ?? getContrast(this.fillColor ?? '#FFFFFF')
        const points = getNodeAttachentPoints(this.point, this.radius, 0, 8);
        const maxWidth = Math.floor(getDistance(points[1], points[7]));
        const maxHeight = Math.floor(getDistance(points[1], points[3]));
        const maxSingleLine = this.radius * 2 - 4;
        this.textPath = new Text2D({
          value: text,
          point: this.point,
          alignment: 'center',
          baseline: 'middle',
          fillColor: this.textColor,
          maxWidth,
          maxHeight,
          maxSingleLine
        });
      }
    }
    this.draw = this.draw.bind(this);
  }

  //TODO: handle text map and unit test
  toJson() {
    const baseJson = super.toJson();
    const fullJson = {
      ...baseJson,
      ...{
        radius: this.radius,
        point: this.point,
        text: serializeMapToString(this.text),
        textColor: this.textColor
      }
    };
    return fullJson;
  }

  toByteArray() {
    const json = this.toJson();
    const bytes = this.encoder.encode(JSON.stringify(json));
    const magicPrefix = new Uint8Array(MagicNumbers.sphere.length + bytes.length);
    magicPrefix.set(MagicNumbers.sphere);
    magicPrefix.set(bytes, MagicNumbers.sphere.length);
    return magicPrefix;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.restore();
    ctx.beginPath();

    if (this.fillColor) {
      ctx.fillStyle = this.fillColor + this.alpha;
      ctx.fill(this.path);
    }

    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
      ctx.strokeStyle = this.strokeColor + this.alpha
      ctx.lineWidth = 4;
      ctx.stroke(this.path);
    }

    if (this.textPath) {
      this.textPath.draw(ctx);
    }
  }
}

