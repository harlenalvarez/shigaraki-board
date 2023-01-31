import { MagicNumbers, ShapeTypes } from '@/types';

export const hasMagicNumber = (payload: Uint8Array, magicNumber: Uint8Array) => {
  return payload.subarray(0, magicNumber.length).every((byte, index) => byte === magicNumber[index]);
};

/**
 * Finds if an array of objects magic number matches the check value
 * @param possibleNumber
 * @param canvasObjects
 * @returns index of the object it matched or -1
 */
export const findShape = (possibleNumber: Uint8Array) => {
  const objectTypes: Array<keyof typeof ShapeTypes> = ['box', 'text'];
  const index = findMagicNumber(possibleNumber, MagicNumbers.box, MagicNumbers.text);
  // can't return -1 as it will bit 0 with box that is 0b1
  if (index < 0) return -10;

  return ShapeTypes[objectTypes[index]];
};

const findMagicNumber = (possibleNumber: Uint8Array, ...canvasObjects: Uint8Array[]) => {
  for (let i = 0; i < canvasObjects.length; i++) {
    let j = 0;
    for (; j < canvasObjects[i].length; j++) {
      if (canvasObjects[i][j] !== possibleNumber[j]) break;
    }
    if (j === canvasObjects[i].length) return i;
  }
  return -1;
};
