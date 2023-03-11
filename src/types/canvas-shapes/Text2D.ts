import { styleColors } from '@/store';
import { hasMagicNumber } from '@/utils';
import { Need } from '@practicaljs/canvas-kit';
import { ShapesBase, type Serializable } from '../ShapesBase';
import { MagicNumbers } from './ShapesService';

export class Text2D extends ShapesBase implements Serializable {
  value: string;
  font: string;
  alignment: 'start' | 'end' | 'left' | 'center' | 'right';
  baseline: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';

  constructor(props: Need<Text2D, 'value' | 'point'>) {
    super(props);
    this.value = props.value;
    this.point = props.point;
    this.font = props.font ?? '20px Verdana';
    this.alignment = props.alignment ?? 'start';
    this.baseline = props.baseline ?? 'alphabetic';

    this.color = props.color ?? styleColors.textDark;
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

  toByteArray() {
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
    const magicPrefix = new Uint8Array(MagicNumbers.text.length + objectArray.length);
    magicPrefix.set(MagicNumbers.text);
    magicPrefix.set(objectArray, MagicNumbers.text.length);
    return magicPrefix;
  }

  static fromByteArray(payload: Uint8Array) {
    if (!Text2D.byteArrayIsTypeOf(payload)) return null;
    const decodedPayload = ShapesBase.decoder.decode(payload.subarray(MagicNumbers.text.length));
    const textJson = JSON.parse(decodedPayload) as Text2D;
    return new Text2D(textJson);
  }

  static byteArrayIsTypeOf(payload: Uint8Array) {
    return hasMagicNumber(payload, MagicNumbers.text);
  }

  setScale(scale: number) { }
}
