import { FontStyle } from '@practicaljs/canvas-kit';
import { describe, expect, test } from 'vitest';
import { generateShapeFromByteArray } from '../canvas-shapes/ShapesFactory';
import { Text2D } from '../canvas-shapes/Text2D';

describe('Text2D', () => {
  test('Should return byte array and create object from byte array', () => {
    const font = { fontWeight: 400, fontFamily: 'Verdana', fontSize: 14 }
    const values = new Map<string, FontStyle>()
    values.set('foo', font)
    values.set('1', font)
    const test = new Text2D({
      value: values,
      point: { x: 0, y: 0 },
      fillColor: 'blue',
      strokeColor: 'red',
      maxHeight: 1,
      maxWidth: 2,
      maxSingleLine: 3
    });

    const bytes = test.toByteArray();
    expect(bytes).not.toBeNull();
    expect(bytes.length).toBeGreaterThan(0);

    const fromSerialized = generateShapeFromByteArray(bytes) as Text2D
    expect(fromSerialized).not.toBeNull();
    if (fromSerialized == null) return;
    // check that the first font is foo and second is 1 ( order is maintained )
    const valuesText = fromSerialized.value.keys()
    expect(valuesText.next().value).toEqual('foo')
    expect(valuesText.next().value).toEqual('1')

    expect(fromSerialized.point.x).toBe(0);
    expect(fromSerialized.point.y).toBe(0);
    expect(fromSerialized.fillColor).toEqual('blue');
    expect(fromSerialized.strokeColor).toEqual('red');
    expect(fromSerialized.maxHeight).toBe(1);
    expect(fromSerialized.maxWidth).toBe(2);
    expect(fromSerialized.maxSingleLine).toBe(3);
  });
});
