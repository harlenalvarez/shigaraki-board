import { isType, type ICanvasComponent } from '@/types';
import { generateShapeFromByteArray } from '@/types/canvas-shapes/ShapesFactory';

let subscribers: Set<() => void> = new Set();
const notify = () => {
  subscribers.forEach(s => { s(); });
};

class RenderedObject<T> {
  next: RenderedObject<T> | null;
  value: T | null;
  prev: RenderedObject<T> | null;
  constructor(value?: T) {
    this.value = value ?? null;
    this.prev = null;
    this.next = null;
  }
}

export class RenderedObjects {
  head: RenderedObject<ICanvasComponent> | null;
  tail: RenderedObject<ICanvasComponent> | null;
  private _length: number;
  get length() {
    return this._length;
  }

  constructor(latest?: RenderedObject<ICanvasComponent>) {
    this.head = latest ?? null;
    this.tail = null;
    if (this.head != null) {
      this._length = 1;
    } else {
      this._length = 0;
    }
    this.getSnapshot = this.getSnapshot.bind(this);
  }

  push(value: ICanvasComponent) {
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
    notify();
  }

  remove(node: RenderedObject<ICanvasComponent> | null) {
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
    if (node) {
      notify();
    }
    return node ?? null;
  }

  pop() {
    if (this.tail == null) return this.remove(this.head);
    return this.remove(this.tail);
  }

  dequeue() {
    if (this.head == null) return this.remove(this.tail);
    return this.remove(this.head);
  }

  *[Symbol.iterator]() {
    let curr = this.head;
    while (curr != null) {
      yield curr;
      curr = curr.next;
    }
  }

  clear() {
    let current = this.head;
    while ((current?.next) != null) {
      current.value = null;
      current = current.next;
    }
    this.head = null;
    this.tail = null;
    this._length = 0;
    notify();
  }

  * toByteArray() {
    for (const node of this) {
      if (node.value === null) continue;
      if (isType<ICanvasComponent>(node.value, 'toByteArray')) {
        yield node.value.toByteArray();
      }
    }
  }

  fromByteArray(nodes: ArrayBufferLike[] | Uint8Array[]) {
    if (nodes[0] instanceof ArrayBuffer) {
      this.fromUint8ByteArray(nodes.map(node => new Uint8Array(node)));
    } else {
      this.fromUint8ByteArray(nodes as Uint8Array[]);
    }
  }

  fromUint8ByteArray(nodes: Uint8Array[]) {
    for (const node of nodes) {
      this.parseAndPush(node);
    }
  }

  parseAndPush(node: Uint8Array) {
    const shape = generateShapeFromByteArray(node)
    if (!shape) return;
    this.push(shape)
  }

  // react specific
  subscribe = (onStoreChange: () => void) => {
    subscribers.add(onStoreChange);
    return () => {
      subscribers.delete(onStoreChange);
    };
  };

  getSnapshot() {
    return 'ignore';
  }
}

export const renderedObjects = new RenderedObjects();
