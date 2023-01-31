import { describe, expect, test } from 'vitest';
import { Box2D } from '../canvas-shapes/Box2D';
import { Text2D } from '../canvas-shapes/Text2D';

describe('Box2D tests', () => {

  test('Should get array buffer and create from buffer', () => {
    const box = new Box2D({
      width: 100,
      height: 50,
      point: { x: 10, y: 10 },
      radius: 10
    });

    const nestedDiv = new Box2D({
      width: 30,
      height: 15,
      point: { x: 10, y: 10 },
      color: 'gray',
      strokeColor: 'blue'
    });

    box.boxes.push(nestedDiv);

    const boxArray = box.toByteArray();
    expect(boxArray.length).toBeGreaterThan(0);

    expect(Box2D.byteArrayIsTypeOf(boxArray)).toBe(true);

    const fromArray = Box2D.fromByteArray(boxArray);
    expect(fromArray).not.toBeNull();
    if (fromArray == null) return;
    expect(fromArray.width).toBe(100);
    expect(fromArray.height).toBe(50);
    expect(fromArray.point.x).toBe(10);
    expect(fromArray.point.y).toBe(10);
    expect(fromArray.boxes.length).toBe(1);
  });

  test('Should fail magic number check', () => {
    const box = new Box2D({
      width: 100,
      height: 50,
      point: { x: 10, y: 10 },
      radius: 10
    });

    const boxArray = box.toByteArray();
    const result = Text2D.byteArrayIsTypeOf(boxArray);
    expect(result).toBe(false);
  });

});
