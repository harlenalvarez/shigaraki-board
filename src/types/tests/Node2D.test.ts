import { FontStyle } from '@practicaljs/canvas-kit';
import { describe, expect, test } from 'vitest';
import { Node2D } from '../canvas-shapes';
import { generateShapeFromByteArray } from '../canvas-shapes/ShapesFactory';

describe('Node2D', () => {
  test('Should return byte array and create object from byte array', () => {
    const font = { fontWeight: 400, fontFamily: 'Verdana', fontSize: 14 }
    const values = new Map<string, FontStyle>()
    values.set('foo', font)
    values.set('1', font)
    const test = new Node2D({
      radius: 15,
      point: { x: 0, y: 0 },
      fillColor: '#020561',
      strokeColor: '#bd062a',
      text: values,
      textColor: '#FFF111'
    });

    const bytes = test.toByteArray();
    expect(bytes).not.toBeNull();
    expect(bytes.length).toBeGreaterThan(0);

    const fromSerialized = generateShapeFromByteArray(bytes) as Node2D
    expect(fromSerialized).not.toBeNull();
    if (fromSerialized == null) return;
    // check that the first font is foo and second is 1 ( order is maintained )
    const valuesText = fromSerialized.text.keys()
    expect(valuesText.next().value).toEqual('foo')
    expect(valuesText.next().value).toEqual('1')

    expect(fromSerialized.point.x).toBe(0);
    expect(fromSerialized.point.y).toBe(0);
    expect(fromSerialized.fillColor).toEqual('#020561');
    expect(fromSerialized.strokeColor).toEqual('#bd062a');
    expect(fromSerialized.textPath?.maxHeight).toBe(21);
    expect(fromSerialized.textPath?.maxWidth).toBe(21);
    expect(fromSerialized.textPath?.maxSingleLine).toBe(26);
    expect(fromSerialized.textColor).toBe('#FFF111');
  });
});
