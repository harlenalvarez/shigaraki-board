import { hasMagicNumber } from '@/utils';
import { Need } from '../reducer';
import { Point } from '../Shapes';
import { Serializable, ShapesBase } from '../ShapesBase';
import { MagicNumbers } from './ShapesService';

export class Sphere2D extends ShapesBase implements Serializable {
  radius: number;
  path: Path2D;

  constructor(props: Need<Sphere2D, 'radius' | 'point'>) {
    super(props);
    this.radius = props.radius;
    this.point = props.point;

    this.path = new Path2D();
    this.path.arc(this.point.x, this.point.y, this.radius, 0, 2 * Math.PI);
  }

  toJson(): { point: Point; color: string; strokeColor: string | undefined; } {
    const baseJson = super.toJson();
    const fullJson = {
      ...baseJson,
      ...{
        radius: this.radius,
        point: this.point
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

  static fromByteArray(payload: Uint8Array) {
    if (!Sphere2D.byteArrayIsTypeOf(payload)) return null;
    const fullString = ShapesBase.decoder.decode(payload.slice(MagicNumbers.box.length));
    const thisJson = JSON.parse(fullString) as Sphere2D;
    const parent = new Sphere2D(thisJson);
    return parent;
  };

  static byteArrayIsTypeOf(payload: Uint8Array) {
    return hasMagicNumber(payload, MagicNumbers.sphere);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.restore();
    ctx.beginPath();

    if (this.color !== '') {
      ctx.fillStyle = this.color;
      ctx.fill(this.path);
    }

    if (this.strokeColor != null && this.strokeColor !== '') {
      ctx.strokeStyle = this.strokeColor;
      ctx.stroke(this.path);
    }
  }

}