import { RenderedObjects } from '@/store';
import { hasMagicNumber } from '@/utils/bytes.helpers';
import { Need } from './reducer';
import { Serializable, ShapesBase } from './ShapesBase';

export class Box2D extends ShapesBase implements Serializable {
  width: number;
  height: number;
  radius: number;
  path: Path2D;
  boxes: RenderedObjects<Box2D> = new RenderedObjects();
  constructor (props: Need<Box2D, 'width' | 'height' | 'point'>) {
    super(props);

    this.point = props.point;
    this.width = props.width;
    this.height = props.height;
    this.radius = props.radius ?? 4;

    this.path = new Path2D();

    if (this.radius === 0) { this.path.rect(this.point.x, this.point.y, this.width, this.height); } else { this.path.roundRect(this.point.x, this.point.y, this.width, this.height, this.radius); }
    this.draw = this.draw.bind(this);
  }

  draw (ctx: CanvasRenderingContext2D) {
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

  toJson () {
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

  toByteArray () {
    const json = this.toJson();
    const bytes = this.encoder.encode(JSON.stringify(json));
    const magicPrefix = new Uint8Array(Box2D.magicNumber.length + bytes.length);
    magicPrefix.set(Box2D.magicNumber);
    magicPrefix.set(bytes, Box2D.magicNumber.length);
    return magicPrefix;
  }

  static fromByteArray (payload: Uint8Array) {
    if (!Box2D.byteArrayIsTypeOf(payload)) return null;
    const fullString = ShapesBase.decoder.decode(payload.slice(Box2D.magicNumber.length));
    const thisJson = JSON.parse(fullString) as Box2D;
    const { boxes, ...mainJson } = thisJson;
    const parent = new Box2D(mainJson);
    for (const box of boxes) {
      const child = new Box2D(box as any);
      parent.boxes.push(child);
    }
    return parent;
  };

  static get magicNumber () {
    return new Uint8Array([0x95, 0x76, 0xD5, 0xFF]);
  }

  static byteArrayIsTypeOf (payload: Uint8Array) {
    return hasMagicNumber(payload, Box2D.magicNumber);
  }
}
