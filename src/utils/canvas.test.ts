import { CanvasNodeConnPosition } from '@/types/Shapes';
import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { getClickedPoint, getConnectionPoints, getDistance, getMidPoint, getSlope } from './canvas';

describe('Cavnas Utilities', () => {
  test('Should return null if no canvas passed', () => {
    expect(() => getClickedPoint({ clientX: 1, clientY: 1 })).toThrowError();
  });

  test('Should return canvas x, y position based on where the user clicked', () => {
    const event = { clientX: 1, clientY: 1 } satisfies Partial<React.MouseEvent>;
    const mockCanvas: Partial<HTMLCanvasElement> = {
      getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, width: 100, height: 100, x: 0, y: 0, bottom: 0, toJSON: vi.fn() })
    };
    const [x, y] = getClickedPoint(event, mockCanvas as HTMLCanvasElement);
    expect(x).toBe(1);
    expect(y).toBe(1);
  });

  test('Should return canvas x, y position based on where the user clicked if scrolled', () => {
    const event = { clientX: 1, clientY: 1 } satisfies Partial<React.MouseEvent>;
    const mockCanvas: Partial<HTMLCanvasElement> = {
      getBoundingClientRect: () => ({ top: -2, left: 0, right: 0, width: 100, height: 100, x: 0, y: 0, bottom: 0, toJSON: vi.fn() })
    };
    const [x, y] = getClickedPoint(event, mockCanvas as HTMLCanvasElement) ?? [-1, -1];
    expect(x).toBe(1);
    expect(y).toBe(3);
  });

  test('Should calculate midpoint', () => {
    const result = getMidPoint({ x: 0, y: 0 }, { x: 10, y: 10 });
    expect(result).toMatchObject({ x: 5, y: 5 });
    const secondMidpoint = getMidPoint({ x: 0, y: 0 }, { x: 8, y: 9 });
    expect(secondMidpoint).toMatchObject({ x: 4, y: 4.5 });

    const third = getMidPoint({ x: 0, y: 0 }, { x: 8, y: -1 });
    expect(third).toMatchObject({ x: 4, y: -0.5 });
  });

  test('Should calculate distance', () => {
    const result = getDistance({ x: 0, y: 0 }, { x: 10, y: 10 });
    expect(result).toBe(14.14);

    const second = getDistance({ x: 0, y: 0 }, { x: 8, y: 9 });
    expect(second).toBe(12.04);

    const third = getDistance({ x: 0, y: 0 }, { x: 8, y: -1 });
    expect(third).toBe(8.06);
  });

  test('Should find closest point', () => {
    const nodeA = { point: { x: 0, y: 0 }, radius: 3 };
    const nodeB = { point: { x: 10, y: 10 }, radius: 3 };

    const connection = getConnectionPoints(nodeA, nodeB);
    expect(connection.nodeA.point).toMatchObject({ x: 3, y: 0 });
    expect(connection.nodeB.point).toMatchObject({ x: 10, y: 7 });

    expect(connection.nodeA.position & (CanvasNodeConnPosition.right | CanvasNodeConnPosition.left)).toBeTruthy();
  });

  test('Should get slope', () => {
    const result = getSlope({ x: 0, y: 0 }, { x: 2, y: 2 });
    expect(result).toBe(1);

    const result1 = getSlope({ x: 0, y: 0 }, { x: 4, y: 2 });
    expect(result1).toBe(0.5);
  });

  test('Should check if linear or no slope', () => {
    const result = getSlope({ x: 0, y: 0 }, { x: 2, y: 0 });
    expect(result).toBe(0);

    const result1 = getSlope({ x: 0, y: 0 }, { x: 0, y: 2 });
    expect(result1).toBe(0);
  });
});
