import { hasMagicNumber } from '@/utils';
import { Div2D } from './Div2D';
import { Node2D } from './Node2D';
import { MagicNumbers } from './ShapesService';
import { Text2D } from './Text2D';

const decoder: TextDecoder = new TextDecoder();
const generateText2D = (payload: Uint8Array) => {
  const decodedPayload = decoder.decode(payload.subarray(MagicNumbers.text.length));
  const textJson = JSON.parse(decodedPayload) as Text2D;
  return new Text2D(textJson);
}

const generateDiv2D = (payload: Uint8Array) => {
  const fullString = decoder.decode(payload.slice(MagicNumbers.box.length));
  const thisJson = JSON.parse(fullString) as Div2D;
  const { boxes, ...mainJson } = thisJson;
  const parent = new Div2D(mainJson);
  for (const box of boxes) {
    const child = new Div2D(box as any);
    parent.boxes.push(child);
  }
  return parent;
}

const generateNode2D = (payload: Uint8Array) => {
  const fullString = decoder.decode(payload.slice(MagicNumbers.box.length));
  const thisJson = JSON.parse(fullString) as Node2D;
  const parent = new Node2D(thisJson);
  return parent;
}

export const generateShapeFromByteArray = (payload: Uint8Array) => {
  if (hasMagicNumber(payload, MagicNumbers.text)) {
    return generateText2D(payload);
  }

  if (hasMagicNumber(payload, MagicNumbers.box)) {
    return generateDiv2D(payload);
  }

  if (hasMagicNumber(payload, MagicNumbers.sphere)) {
    return generateNode2D(payload);
  }

  return null
}