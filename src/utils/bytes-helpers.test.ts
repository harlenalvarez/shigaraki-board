import { Div2D, ShapeTypes, Text2D } from '@/types';
import { FontStyle } from '@practicaljs/canvas-kit';
import { describe, expect, test } from 'vitest';
import { findShape, hasMagicNumber } from './bytes.helpers';

const mockStyle: FontStyle = {
  fontFamily: 'test family',
  fontSize: 1,
  fontWeight: 100
};
describe('Bytes Helpers', () => {
  test('Should detect if magic number is present', () => {
    const testMagic = new Uint8Array([0xA1, 0xFF, 0xC4]);
    const testPayload = new Uint8Array([0xA1, 0xFF, 0xC4, 0x12, 0xdd, 0x5d]);
    const result = hasMagicNumber(testPayload, testMagic);
    expect(result).toBe(true);
  });

  test('Should find shape from array', () => {
    const box = new Div2D({ width: 100, height: 100, point: { x: 0, y: 0 } });
    const array = box.toByteArray();

    const result = findShape(array.subarray(0, 5));
    expect(result & ShapeTypes.box).toBeTruthy();
    expect(result & ShapeTypes.text).toBeFalsy();

    const text = new Text2D({ value: new Map([['Example', mockStyle]]), point: { x: 0, y: 0 } });
    const textArray = text.toByteArray();

    const textResult = findShape(textArray.subarray(0, 5));
    expect(textResult & ShapeTypes.text).toBeTruthy();
  });
});
