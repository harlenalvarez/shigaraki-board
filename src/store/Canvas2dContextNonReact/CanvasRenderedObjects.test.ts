import { Text2D } from '@/types';
import { generateShapeFromByteArray } from '@/types/canvas-shapes/ShapesFactory';
import { FontStyle } from '@practicaljs/canvas-kit';
import { afterEach, describe, expect, test } from 'vitest';
import { renderedObjects } from './CanvasRenderedObjects';

const mockStyle: FontStyle = {
  fontFamily: 'test family',
  fontSize: 1,
  fontWeight: 100
};
const firstobjectadded = new Text2D({ value: new Map([['test', mockStyle]]), point: { x: 0, y: 0 } });
const secondObj = new Text2D({ value: new Map([['second', mockStyle]]), point: { x: 0, y: 0 } });
const third = new Text2D({ value: new Map([['third', mockStyle]]), point: { x: 0, y: 0 } });

describe('Render object structure', () => {
  afterEach(() => {
    renderedObjects.clear();
  });

  test('Should act as a queue keeping pointer to head and tail', () => {
    renderedObjects.push(firstobjectadded);
    let headText = renderedObjects.head?.value as Text2D;
    expect(Object.fromEntries(headText.value)).toMatchObject({ 'test': mockStyle });
    expect(renderedObjects.tail).toBeNull();
    renderedObjects.push(secondObj);
    headText = renderedObjects.head?.value as Text2D;
    expect(Object.fromEntries(headText.value)).toMatchObject({ 'test': mockStyle });
    const secondText = renderedObjects.head?.next?.value as Text2D;
    expect(Object.fromEntries(secondText.value)).toMatchObject({ 'second': mockStyle });
    let tailText = renderedObjects.tail?.value as Text2D;
    expect(Object.fromEntries(tailText.value)).toMatchObject({ 'second': mockStyle });
    let prevFromTailText = renderedObjects.tail?.prev?.value as Text2D;
    expect(Object.fromEntries(prevFromTailText.value)).toMatchObject({ 'test': mockStyle });

    renderedObjects.push(third);
    tailText = renderedObjects.tail?.value as Text2D;
    expect(Object.fromEntries(tailText.value)).toMatchObject({ 'third': mockStyle });
    prevFromTailText = renderedObjects.tail?.prev?.value as Text2D;
    expect(Object.fromEntries(prevFromTailText.value)).toMatchObject({ 'second': mockStyle });
  });

  test('Should pop from list (last element)', () => {
    renderedObjects.push(firstobjectadded);
    renderedObjects.push(secondObj);
    renderedObjects.push(third);
    expect(renderedObjects.length).toBe(3);

    // pop first (2 remaining)
    const popped = renderedObjects.pop();
    expect(renderedObjects.length).toBe(2);
    const poppedNode = popped?.value as Text2D;
    expect(Object.fromEntries(poppedNode.value)).toMatchObject({ 'third': mockStyle });
    const headText = renderedObjects.head?.value as Text2D;
    expect(Object.fromEntries(headText.value)).toMatchObject({ 'test': mockStyle });
    const tailText = renderedObjects.tail?.value as Text2D;
    expect(Object.fromEntries(tailText.value)).toMatchObject({ 'second': mockStyle });
    expect(renderedObjects.head?.next).toBe(renderedObjects.tail);

    // pop second (1 reminaing)
    const poppedSecond = renderedObjects.pop();
    expect(renderedObjects.length).toBe(1);
    const secondText = poppedSecond?.value as Text2D;
    expect(Object.fromEntries(secondText.value)).toMatchObject({ 'second': mockStyle });

    // pop last (0 reminaing)
    const poppedFirst = renderedObjects.pop();
    expect(renderedObjects.length).toBe(0);
    const poppedFirstText = poppedFirst?.value as Text2D;
    expect(Object.fromEntries(poppedFirstText.value)).toMatchObject({ 'test': mockStyle });
    expect(renderedObjects.head).toBe(null);

    // try to pop when no more are left
    const poppedNull = renderedObjects.pop();
    expect(poppedNull).toBeNull();
    expect(renderedObjects.length).toBe(0);
  });

  test('Should remove first element with deque', () => {
    renderedObjects.push(firstobjectadded);
    renderedObjects.push(secondObj);
    renderedObjects.push(third);

    // dequeue first element (2 remaining)
    const dequeue = renderedObjects.dequeue();
    expect(renderedObjects.length).toBe(2);
    const first = dequeue?.value as Text2D;
    expect(Object.fromEntries(first.value)).toMatchObject({ 'test': mockStyle });

    // dequeue second (1 remaining)
    const second = renderedObjects.dequeue();
    expect(renderedObjects.length).toBe(1);
    const secondNode = second?.value as Text2D;
    expect(Object.fromEntries(secondNode.value)).toMatchObject({ 'second': mockStyle });

    // dequeue last (0 remininag)
    const last = renderedObjects.dequeue();
    expect(renderedObjects.length).toBe(0);
    const lastNode = last?.value as Text2D;
    expect(Object.fromEntries(lastNode.value)).toMatchObject({ 'third': mockStyle });

    // dequeue null
    const nullValue = renderedObjects.dequeue();
    expect(renderedObjects.length).toBe(0);
    expect(nullValue).toBeNull();
  });

  test('Should remove a node at any position', () => {
    renderedObjects.push(firstobjectadded);
    renderedObjects.push(secondObj);
    renderedObjects.push(third);

    const second = renderedObjects.head?.next ?? null;

    const removedSecond = renderedObjects.remove(second);
    expect(removedSecond).toBe(second);
    // expect that head next points to the tail
    expect(renderedObjects.head?.next).toBe(renderedObjects.tail);
  });

  test('Should iterate', () => {
    renderedObjects.push(firstobjectadded);
    renderedObjects.push(secondObj);
    renderedObjects.push(third);
    let index = 0;
    for (const node of renderedObjects) {
      if (index === 0) {
        const firstObj = node.value as Text2D
        expect(firstObj.value.keys().next().value).toMatchObject('test');
      }
      else if (index === 1) {
        const secObj = node.value as Text2D
        expect(secObj.value.keys().next().value).toMatchObject('second');
      }
      else if (index === 2) {
        const thirdObj = node.value as Text2D
        expect(thirdObj.value.keys().next().value).toMatchObject('third');
      }
      else { expect(true).toBe(false); }
      index++;
    }
  });

  test('Should get array stream', () => {
    renderedObjects.push(firstobjectadded);
    renderedObjects.push(secondObj);
    renderedObjects.push(third);

    const iterator = renderedObjects.toByteArray();
    const { value: firstArray } = iterator.next();
    expect(firstArray).not.toBeNull();
    if (firstArray == null) return;
    const firstObj = generateShapeFromByteArray(firstArray) as Text2D;
    expect(firstObj).not.toBeNull();
    if (firstObj == null) return;
    expect(firstObj.value).toEqual(firstobjectadded.value);
  });

  test('Should populate objects from array stream', () => {
    renderedObjects.push(firstobjectadded);
    renderedObjects.push(secondObj);
    renderedObjects.push(third);
    const arrayObjects = [...renderedObjects.toByteArray()];
    renderedObjects.clear();
    renderedObjects.fromByteArray(arrayObjects);
    expect(renderedObjects.length).toBe(3);
    const firstObj = renderedObjects.head?.value as Text2D
    expect(firstObj.value.keys().next().value).toMatchObject('test');
  });
});
