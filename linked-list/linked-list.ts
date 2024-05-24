class ListNode<T> {

  public value = null;
  private next = null;

  public constructor(value: T, next: ListNode<T> = null) {
    this.value = value;
    this.next = next;
  }

  public getNext(): ListNode<T> {
    return this.next;
  }

  public setNext(node: ListNode<T>) {
    this.next = node;
  }
}

export class LinkedList<T> {

  private head: ListNode<T> = null;
  private tail: ListNode<T> = null;
  private length = 0;

  public constructor(...args: T[]) {
    this.create(args);
  }

  public getHead(): ListNode<T> {
    return this.head;
  }

  public getTail(): ListNode<T> {
    return this.tail;
  }

  private create(values: T[]) {
    values.forEach(value => {
      const node = new ListNode(value);
      if (!this.head) {
        this.head = node;
        this.tail = node;
      } else {
        this.tail.setNext(node);
        this.tail = node;
      }
      this.length++;
    });
  }

  public static fromArray<T>(values: T[]): LinkedList<T> {
    return new LinkedList(...values);
  }

  public toArray(): T[] {

    let values = [];
    let current = this.head;
    while (current) {
      values.push(current.value);
      current = current.getNext();
    }
    return values;
  }

  public toString(): string {
    return this.toArray().toString();
  }

  public append(value: T) {

    const node = new ListNode(value);
    this.tail.setNext(node);
    this.tail = node;
    this.length++;
    return this;
  }

  public prepend(value: T) {

    this.head = new ListNode(value, this.head);
    this.length++;
    return this;
  }

  public appendAfter(value: T, afterValue: T) {

    const curNode = this.findFirst(afterValue);
    if (!curNode) {
      return null;
    }
    const newNode = new ListNode(value, curNode.getNext());
    curNode.setNext(newNode);
    this.length++;
    return newNode;
  }

  public find(value: T): ListNode<T>[] {

    const findNodes: ListNode<T>[] = [];

    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.value === value) {
        findNodes.push(currentNode);
      }
      currentNode = currentNode.getNext();
    }

    return findNodes;
  }

  public findFirst(value: T): ListNode<T> {
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.value === value) {
        return currentNode;
      }
      currentNode = currentNode.getNext();
    }
    return null;
  }

  public delete(value: T): number {

    let count = 0;

    if (!this.head) {
      return 0;
    }

    while (this.head && this.head.value === value) {
      count++;
      this.head = this.head.getNext();
    }

    let currentNode = this.head;

    while (currentNode?.getNext()) {
      if (currentNode.getNext().value === value) {
        count++;
        currentNode.setNext(currentNode.getNext().getNext());
      } else {
        currentNode = currentNode.getNext();
      }
    }
    return count;
  }

  public getLength(): number {
    return this.length;
  }
}
