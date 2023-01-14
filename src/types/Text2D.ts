import { Colors } from '@/store';
import { hasMagicNumber } from '@/utils/bytes.helpers';
import { Need } from './reducer';
import { Serializable, ShapesBase } from './ShapesBase';

export class Text2D extends ShapesBase implements Serializable {
  value: string;
  font: string;
  alignment: 'start' | 'end' | 'left' | 'center' | 'right';
  baseline: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';

  constructor (props: Need<Text2D, 'value' | 'point'>) {
    super(props);
    this.value = props.value;
    this.point = props.point;
    this.font = props.font ?? '20px Verdana';
    this.alignment = props.alignment ?? 'start';
    this.baseline = props.baseline ?? 'alphabetic';

    this.color = props.color ?? Colors.TextDark;
    this.strokeColor = props.strokeColor;
    this.draw = this.draw.bind(this);
  }

  draw (ctx: CanvasRenderingContext2D) {
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

  toByteArray () {
    const baseJson = this.toJson();
    const textJson = {
      ...baseJson,
      ...{
        value: this.value,
        font: this.font,
        alignment: this.alignment,
        baseline: this.baseline
      }
    };
    const string = JSON.stringify(textJson);
    const objectArray = this.encoder.encode(string);
    const magicPrefix = new Uint8Array(Text2D.magicNumber.length + objectArray.length);
    magicPrefix.set(Text2D.magicNumber);
    magicPrefix.set(objectArray, Text2D.magicNumber.length);
    return magicPrefix;
  }

  static fromByteArray (payload: Uint8Array) {
    if (!Text2D.byteArrayIsTypeOf(payload)) return null;
    const decodedPayload = ShapesBase.decoder.decode(payload.slice(Text2D.magicNumber.length));
    const textJson = JSON.parse(decodedPayload) as Text2D;
    return new Text2D(textJson);
  }

  static get magicNumber () {
    return new Uint8Array([0x95, 0xB6, 0xD6, 0x1F]);
  }

  static byteArrayIsTypeOf (payload: Uint8Array) {
    return hasMagicNumber(payload, Text2D.magicNumber);
  }
}
