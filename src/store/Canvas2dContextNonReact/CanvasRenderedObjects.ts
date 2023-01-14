import { Box2D, isType, Text2D } from '@/types';
import { Serializable } from '@/types/ShapesBase';

class RenderedObject<T> {
  next: RenderedObject<T> | null;
  value: T | null;
  prev: RenderedObject<T> | null;
  constructor (value?: T) {
    this.value = value ?? null;
    this.prev = null;
    this.next = null;
  }
}

export class RenderedObjects<T> {
  head: RenderedObject<T> | null;
  tail: RenderedObject<T> | null;
  private _length: number;
  get length () {
    return this._length;
  }

  constructor (latest?: RenderedObject<T>) {
    this.head = latest ?? null;
    this.tail = null;
    if (this.head != null) {
      this._length = 1;
    } else {
      this._length = 0;
    }
    this.push = this.push.bind(this);
    this.pop = this.pop.bind(this);
    this.clear = this.clear.bind(this);
    this.dequeue = this.dequeue.bind(this);
    this.remove = this.remove.bind(this);
  }

  push (value: T) {
    this._length++;
    const node = new RenderedObject(value);
    if (this.head == null) {
      this.head = node;
      return;
    }
    if (this.head.next == null) {
      this.head.next = node;
      node.prev = this.head;
      this.tail = node;
      return;
    }

    if (this.tail == null) {
      this._length--;
      throw new Error('Tail is empty');
    }

    this.tail.next = node;
    node.prev = this.tail;
    this.tail = node;
  }

  remove (node: RenderedObject<T> | null) {
    if (node == null) return null;
    this._length--;

    if (node.next != null) { node.next.prev = node.prev; }
    if (node.prev != null) { node.prev.next = node.next; }

    if (node === this.tail) {
      this.tail = node.prev;
    }
    if (node === this.head) {
      this.head = node.next;
    }
    return node ?? null;
  }

  pop () {
    if (this.tail == null) return this.remove(this.head);
    return this.remove(this.tail);
  }

  dequeue () {
    if (this.head == null) return this.remove(this.tail);
    return this.remove(this.head);
  }

  * [Symbol.iterator] () {
    let curr = this.head;
    while (curr != null) {
      yield curr;
      curr = curr.next;
    }
  }

  clear () {
    let current = this.head;
    while ((current?.next) != null) {
      current.value = null;
      current = current.next;
    }
    this.head = null;
    this.tail = null;
    this._length = 0;
  }

  * toByteArray () {
    for (const node of this) {
      if (node.value === null) continue;
      if (isType<Serializable>(node.value, 'toByteArray')) {
        yield node.value.toByteArray();
      }
    }
  }

  fromByteArray () { }
}

export const renderedObjects = new RenderedObjects<Box2D | Text2D>();
