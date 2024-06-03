export class Node<T> {
  public value: T;
  private left: Node<T> | null;
  private right: Node<T> | null;
  private parent: Node<T> | null;
  // height of subgraph with this node as a root
  private height: number;

  constructor(value: T) {

    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 1;
  }

  getLeft(): Node<T> | null {
    return this.left;
  }

  setLeft(node: Node<T> | null): void {
    if (node) {
      node.parent = this;
    }
    this.left = node;
  }

  getRight(): Node<T> | null {
    return this.right;
  }

  setRight(node: Node<T> | null): void {
    if (node) {
      node.parent = this;
    }
    this.right = node;
  }

  getParent(): Node<T> | null {
    return this.parent;
  }

  public getHeight(): number {
    return this.height;
  }

  public updateHeight(): void {
    const leftHeight = this.left?.height ?? 0;
    const rightHeight = this.right?.height ?? 0;
    this.height = 1 + Math.max(leftHeight, rightHeight);
  }
}
