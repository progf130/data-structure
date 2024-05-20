export class Node<T> {
  public value: T;
  public left: Node<T> | null;
  public right: Node<T> | null;
  // height of subgraph with this node as a root
  private height: number;

  constructor(value: T) {

    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
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
