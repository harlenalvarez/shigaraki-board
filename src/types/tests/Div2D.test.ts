import { hasMagicNumber } from '@/utils';
import { describe, expect, test } from 'vitest';
import { MagicNumbers } from '../canvas-shapes';
import { Div2D } from '../canvas-shapes/Div2D';
import { generateShapeFromByteArray } from '../canvas-shapes/ShapesFactory';

describe('Box2D tests', () => {
  test('Should get array buffer and create from buffer', () => {
    const box = new Div2D({
      width: 100,
      height: 50,
      point: { x: 10, y: 10 },
      radius: 10
    });

    const nestedDiv = new Div2D({
      width: 30,
      height: 15,
      point: { x: 10, y: 10 },
      fillColor: 'grey',
      strokeColor: 'blue'
    });

    box.boxes.push(nestedDiv);

    const boxArray = box.toByteArray();
    expect(boxArray.length).toBeGreaterThan(0);
    expect(hasMagicNumber(boxArray, MagicNumbers.box)).toBe(true)


    const fromArray = generateShapeFromByteArray(boxArray) as Div2D
    expect(fromArray).not.toBeNull();
    if (fromArray == null) return;
    expect(fromArray.width).toBe(100);
    expect(fromArray.height).toBe(50);
    expect(fromArray.point.x).toBe(10);
    expect(fromArray.point.y).toBe(10);
    expect(fromArray.boxes.length).toBe(1);
  });

  test('Should fail magic number check', () => {
    const box = new Div2D({
      width: 100,
      height: 50,
      point: { x: 10, y: 10 },
      radius: 10
    });

    const boxArray = box.toByteArray();
    const result = hasMagicNumber(boxArray, MagicNumbers.text)
    expect(result).toBe(false);
  });
});
