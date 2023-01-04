import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { getClickedPoint } from './canvas';

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
});
