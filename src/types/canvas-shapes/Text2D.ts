import { fromStringToMap, serializeMapToString } from '@/utils/serializeHelpers';
import { fillTextContained, FontStyle, parseFont, TextAlignment, TextBaseline, type Need } from '@practicaljs/canvas-kit';
import { ShapesBase, type ICanvasComponent } from '../ShapesBase';
import { MagicNumbers } from './ShapesService';

export class Text2D extends ShapesBase implements ICanvasComponent {
  value: Map<string, FontStyle> = new Map();
  alignment: TextAlignment;
  baseline: TextBaseline;

  maxHeight?: number;
  maxWidth?: number;
  maxSingleLine?: number
  private containedLines?: Map<string, FontStyle>;

  constructor(props: Need<Text2D, 'value' | 'point'>) {
    super(props);
    if (typeof props.value === 'string') {
      const formatValue = fromStringToMap<string, FontStyle>(props.value);
      if (!formatValue)
        throw new Error('Invalid value format');
      this.value = formatValue
    }
    else {
      this.value = props.value;
    }
    this.point = props.point;
    this.alignment = props.alignment ?? 'start';
    this.baseline = props.baseline ?? 'alphabetic';
    this.maxHeight = props.maxHeight;
    this.maxWidth = props.maxWidth;
    this.maxSingleLine = props.maxSingleLine;
    this.draw = this.draw.bind(this);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.restore();
    ctx.beginPath();

    ctx.textAlign = this.alignment;
    ctx.textBaseline = this.baseline;

    if (this.fillColor) {
      ctx.fillStyle = this.fillColor + this.alpha;
    }

    if (this.strokeWidth) {
      ctx.lineWidth = this.strokeWidth;
    }

    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor + this.alpha;
    }

    if (this.maxHeight && this.maxWidth) {
      this.containedLines = fillTextContained(
        this.value,
        ctx,
        { maxWidth: this.maxWidth, maxHeight: this.maxHeight, maxSingleLine: this.maxSingleLine, margin: 2, zoom: 1 },
        this.point,
        this.containedLines
      );
    }
    else {
      // this must be single text style line so we just render the line and use the overall font
      if (this.fillColor) {
        for (let line of this.value.entries()) {
          ctx.font = parseFont(line[1]);
          ctx.fillText(line[0], this.point.x, this.point.y)
        }
      }

      if (this.strokeColor) {

      }
    }
  }

  toByteArray() {
    const baseJson = this.toJson();
    const textJson = {
      ...baseJson,
      ...{
        value: serializeMapToString(this.value),
        alignment: this.alignment,
        baseline: this.baseline,
        maxHeight: this.maxHeight,
        maxWidth: this.maxWidth,
        maxSingleLine: this.maxSingleLine
      }
    };
    const string = JSON.stringify(textJson);
    const objectArray = this.encoder.encode(string);
    const magicPrefix = new Uint8Array(MagicNumbers.text.length + objectArray.length);
    magicPrefix.set(MagicNumbers.text);
    magicPrefix.set(objectArray, MagicNumbers.text.length);
    return magicPrefix;
  }

}
