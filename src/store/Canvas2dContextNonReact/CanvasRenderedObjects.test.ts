import { Text2D } from '@/types';
import { afterEach, describe, expect, test } from 'vitest';
import { renderedObjects } from './CanvasRenderedObjects';

const firstobjectadded = new Text2D({ value: 'test', point: { x: 0, y: 0 } });
const secondObj = new Text2D({ value: 'second', point: { x: 0, y: 0 } });
const third = new Text2D({ value: 'third', point: { x: 0, y: 0 } });

describe('Render object structure', () => {
  afterEach(() => {
    renderedObjects.clear();
  });

  test('Should act as a queue keeping pointer to head and tail', () => {
    renderedObjects.push(firstobjectadded);
    expect(renderedObjects.head?.value).toMatchObject({ value: 'test' });
    expect(renderedObjects.tail).toBeNull();
    renderedObjects.push(secondObj);
    expect(renderedObjects.head?.value).toMatchObject({ value: 'test' });
    expect(renderedObjects.head?.next?.value).toMatchObject({ value: 'second' });

    expect(renderedObjects.tail?.value).toMatchObject({ value: 'second' });
    expect(renderedObjects.tail?.prev?.value).toMatchObject({ value: 'test' });

    renderedObjects.push(third);
    expect(renderedObjects.tail?.value).toMatchObject({ value: 'third' });
    expect(renderedObjects.tail?.prev?.value).toMatchObject({ value: 'second' });
  });

  test('Should pop from list (last element)', () => {
    renderedObjects.push(firstobjectadded);
    renderedObjects.push(secondObj);
    renderedObjects.push(third);
    expect(renderedObjects.length).toBe(3);

    // pop first (2 remaining)
    const popped = renderedObjects.pop();
    expect(renderedObjects.length).toBe(2);
    expect(popped?.value).toMatchObject({ value: 'third' });
    expect(renderedObjects.head?.value).toMatchObject({ value: 'test' });
    expect(renderedObjects.tail?.value).toMatchObject({ value: 'second' });
    expect(renderedObjects.head?.next).toBe(renderedObjects.tail);

    // pop second (1 reminaing)
    const poppedSecond = renderedObjects.pop();
    expect(renderedObjects.length).toBe(1);
    expect(poppedSecond?.value).toMatchObject({ value: 'second' });

    // pop last (0 reminaing)
    const poppedFirst = renderedObjects.pop();
    expect(renderedObjects.length).toBe(0);
    expect(poppedFirst?.value).toMatchObject({ value: 'test' });
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
    expect(dequeue?.value).toMatchObject({ value: 'test' });

    // dequeue second (1 remaining)
    const second = renderedObjects.dequeue();
    expect(renderedObjects.length).toBe(1);
    expect(second?.value).toMatchObject({ value: 'second' });

    // dequeue last (0 remininag)
    const last = renderedObjects.dequeue();
    expect(renderedObjects.length).toBe(0);
    expect(last?.value).toMatchObject({ value: 'third' });

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
      if (index === 0) { expect(node.value).toMatchObject({ value: 'test' }); } else if (index === 1) { expect(node.value).toMatchObject({ value: 'second' }); } else if (index === 2) { expect(node.value).toMatchObject({ value: 'third' }); } else { expect(true).toBe(false); }

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
    const firstObj = Text2D.fromByteArray(firstArray);
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
    expect(renderedObjects.head?.value).toMatchObject({ value: 'test' });
  });
});
