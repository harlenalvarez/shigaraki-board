import { Box2D, isType, Text2D } from '@/types';

type RenderedObjectType = {
  type: 'Path2D' | 'Text2D'
  value: Int8Array
}
type RenderedMapDTO = Array<{ [key: string]: RenderedMapDTO }>

class RenderedObjectsMap {
  private _map: Map<string, Box2D | Text2D>;
  constructor() {
    this._map = new Map();
    this.toByteArray = this.toByteArray.bind(this);
  }

  toByteArray() {
    const transferObject: RenderedMapDTO = []
    for (let [key, value] of this._map) {
      let rawObject = {}
      if (isType<Path2D>(value, 'addPath')) {
        //value.
      }
      // transferObject.push({[key]:  })
    }
  }
}

export const renderedObjectsMap = new RenderedObjectsMap();

class RenderedObject {
  next: RenderedObject | null
  value: Box2D | Text2D | null
  prev: RenderedObject | null
  constructor(value?: Box2D | Text2D) {
    this.value = value ?? null;
    this.prev = null;
    this.next = null;
  }
}

class RenderedObjects {
  head: RenderedObject | null
  tail: RenderedObject | null
  length: number;
  constructor(latest?: RenderedObject) {
    this.head = latest ?? null;
    this.tail = null;
    if (this.head) {
      this.length = 1;
    }
    else {
      this.length = 0;
    }
    this.push = this.push.bind(this);
    this.pop = this.pop.bind(this);
    this.clear = this.clear.bind(this);
    this.dequeue = this.dequeue.bind(this);
    this.remove = this.remove.bind(this)
  }

  push(value: Box2D | Text2D) {
    this.length++;
    const node = new RenderedObject(value);
    if (!this.head) {
      this.head = node;
      return;
    }
    if (!this.head.next) {
      this.head.next = node;
      node.prev = this.head;
      this.tail = node;
      return
    }

    if (!this.tail) {
      this.length--;
      throw new Error('Tail is empty')
    }

    this.tail.next = node;
    node.prev = this.tail;
    this.tail = node;
  }

  remove(node: RenderedObject | null | undefined) {
    if (!node) return null;
    this.length--;

    if (node.next)
      node.next.prev = node.prev;
    if (node.prev)
      node.prev.next = node.next;

    if (node === this.tail) {
      this.tail = node.prev;
    }
    if (node === this.head) {
      this.head = node.next;
    }

    return node;
  }

  pop() {
    // if (!this.tail && this.head) {
    //   const head = this.head;
    //   this.head = null;
    //   return head.value;
    // }

    // const tail = this.tail as RenderedObject;
    // if (tail.prev === this.head) {
    //   this.tail = null;
    // }
    // else {
    //   this.tail = tail.prev;
    // }
    // return tail.value;
    if (!this.tail) return this.remove(this.head);
    return this.remove(this.tail);
  }

  dequeue() {
    if (!this.head) return this.remove(this.tail);
    return this.remove(this.head);
  }

  *[Symbol.iterator]() {
    let curr = this.head;
    while (curr) {
      yield curr;
      curr = curr.next;
    }
  }

  clear() {
    let current = this.head;
    while (current?.next) {
      current.value = null;
      current = current.next;
    }
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}

export const renderedObjects = new RenderedObjects()