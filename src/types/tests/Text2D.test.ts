import { describe, expect, test } from 'vitest';
import { Text2D } from '../Text2D';

describe('Text2D', () => {
  test('Should return byte array and create object from byte array', () => {
    const test = new Text2D({
      value: 'foo',
      point: { x: 0, y: 0 },
      color: 'blue',
      strokeColor: 'red'
    });

    const bytes = test.toByteArray();
    expect(bytes).not.toBeNull();
    expect(bytes.length).toBeGreaterThan(0);

    const fromSerialized = Text2D.fromByteArray(bytes);
    expect(fromSerialized).not.toBeNull();
    if (fromSerialized == null) return;
    expect(fromSerialized.value).toEqual('foo');
    expect(fromSerialized.point.x).toBe(0);
    expect(fromSerialized.point.y).toBe(0);
    expect(fromSerialized.color).toEqual('blue');
    expect(fromSerialized.strokeColor).toEqual('red');
  });
});
