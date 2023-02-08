import { hasMagicNumber, translateAngle } from '@/utils';
import { Need } from '../reducer';
import { Point } from '../Shapes';
import { Serializable, ShapesBase } from '../ShapesBase';
import { MagicNumbers } from './ShapesService';
import { Text2D } from './Text2D';

export class Node2D extends ShapesBase implements Serializable {
  radius: number;
  path: Path2D;
  text?: string;
  progress?: number;
  private progressPath?: Path2D;
  private _text?: Text2D;
  get fontColor(): string {
    return this._text?.color ?? '';
  }
  set fontColor(value: string) {
    if (this._text)
      this._text.color = value;
  }
  constructor(props: Need<Node2D, 'radius' | 'point'>) {
    super(props);
    this.radius = props.radius;
    this.point = props.point;

    this.path = new Path2D();
    this.path.arc(this.point.x, this.point.y, this.radius, 0, 2 * Math.PI);

    if (props.text) {
      this.text = props.text;
      this._text = new Text2D({ value: props.text, point: this.point, alignment: 'center', baseline: 'middle' })
    }
    this.fontColor = props.fontColor ?? '';
    if (props.progress) {
      this.progress = props.progress;
      this.progressPath = new Path2D();
      const startAngle = translateAngle(0) * (Math.PI / 180);
      const progressArch = ((props.progress * (Math.PI)) / 50) + startAngle;
      this.progressPath.arc(this.point.x, this.point.y, this.radius + 4, startAngle, progressArch);
    }
    this.draw = this.draw.bind(this);
  }

  toJson(): { point: Point, color: string, strokeColor: string | undefined } {
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
    if (!Node2D.byteArrayIsTypeOf(payload)) return null;
    const fullString = ShapesBase.decoder.decode(payload.slice(MagicNumbers.box.length));
    const thisJson = JSON.parse(fullString) as Node2D;
    const parent = new Node2D(thisJson);
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
      ctx.lineWidth = 4;
      ctx.stroke(this.path);
    }

    if (this._text) {
      this._text.draw(ctx);
    }
    if (this.progressPath && this.progress) {
      ctx.restore();
      ctx.beginPath();
      const colors = {
        above: '#1D8734',
        onplan: '#77B10B',
        medium: '#FB810F',
        risk: '#D93630'
      }
      ctx.strokeStyle = this.progress < 26 ? colors.risk : this.progress < 51 ? colors.medium : this.progress < 76 ? colors.onplan : colors.above;
      if (this.rgbaColor && this.rgbaColor[3] < 1) {
        console.log('HERE')
        const percentage = this.rgbaColor[3] * 100;
        const decimalValue = Math.round((percentage * 255) / 100);
        console.log(decimalValue.toString(16))
        ctx.strokeStyle += decimalValue.toString(16);
      }
      ctx.stroke(this.progressPath);
    }
  }
}


// 100/2PI = P/x = (100x) = (P*2PI)/100 = x