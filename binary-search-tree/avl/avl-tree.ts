import {CompareFn, DFS_TYPES, IAvlTree, TraverseFn} from './avl-tree.interface';
import {Node} from './node';


export abstract class Tree<T> implements IAvlTree<T> {

  protected root: Node<T> | null;
  protected readonly ignoreDuplicates: boolean;
  protected readonly compareFn: CompareFn<T>;

  protected constructor(compareFn: CompareFn<T>, ignoreDuplicates: boolean) {
    this.compareFn = compareFn;
    this.root = null;
    this.ignoreDuplicates = ignoreDuplicates;
  }

  protected getBalancedRootOfSubtree(node: Node<T>): Node<T> {
    const balanceFactor = this.getBalanceFactor(node);
    if (balanceFactor > 1) {
      const left = node.getLeft() as Node<T>;
      if (this.getBalanceFactor(left) >= 0) {
        return this.rotateToRight(node);
      } else {
        node.setLeft(this.rotateToLeft(left));
        return this.rotateToRight(node);
      }
    }
    if (balanceFactor < -1) {
      const right = node.getRight() as Node<T>;
      if (this.getBalanceFactor(right) <= 0) {
        return this.rotateToLeft(node);
      } else {
        node.setRight(this.rotateToRight(right));
        return this.rotateToLeft(node);
      }
    }
    return node;
  }

  protected getBalanceFactor(node: Node<T>): number {
    const leftHeight = node.getLeft()?.getHeight() ?? 0;
    const rightHeight = node.getRight()?.getHeight() ?? 0;
    return leftHeight - rightHeight;
  }

  /**
   * Used to rotate subtree to the left, returns root node of new subtree
   * @param node
   * @private
   */
  private rotateToLeft(node: Node<T>): Node<T> {
    const nodeRight = node.getRight() as Node<T>;
    node.setRight(nodeRight.getLeft() ?? null);
    nodeRight.setLeft(node);
    node.updateHeight();
    nodeRight.updateHeight();
    return nodeRight;
  }

  /**
   * Used to rotate subtree to the right, returns root node of new subtree
   * @param node
   * @private
   */
  private rotateToRight(node: Node<T>): Node<T> {
    const nodeLeft = node.getLeft() as Node<T>;
    node.setLeft(nodeLeft.getRight() ?? null);
    nodeLeft.setRight(node);
    node.updateHeight();
    nodeLeft.updateHeight();
    return nodeLeft;
  }

  public traverseBFS(traverseFn: TraverseFn<T>): void {

    if (!this.root) {
      return;
    }

    const queue = [this.root];
    while (queue.length) {

      const node = queue.shift() as Node<T>;
      traverseFn(node.value);

      const left = node.getLeft();
      if (left) {
        queue.push(left);
      }
      const right = node.getRight();
      if (right) {
        queue.push(right);
      }
    }
  }


  public abstract insert(values: T | T[]): void;

  public abstract traverseDFS(traverseFn: TraverseFn<T>, type?: DFS_TYPES): void;

  public abstract delete(value: T): void;

  public find(value: T): T[] {

    const results: T[] = [];
    let currentNode = this.root;
    while (currentNode) {
      const compareResult = this.compareFn(value, currentNode.value);
      if (compareResult === 0) {
        results.push(currentNode.value);
        if (this.ignoreDuplicates) {
          return results;
        }
        //todo !ignoreDuplicates
      } else if (compareResult < 0) {
        currentNode = currentNode.getLeft();
      } else {
        currentNode = currentNode.getRight();
      }
    }
    return results;
  }

  public getMin(): T | null {
    if (!this.root) {
      return null;
    }

    return this.getMinInNode(this.root).value;
  }

  protected getMinInNode(node: Node<T>): Node<T> {

    let left = node.getLeft();
    while (left) {
      left = node.getLeft();
    }
    return node;
  }

  public getMax(): T | null {
    if (!this.root) {
      return null;
    }

    return this.getMaxInNode(this.root).value;
  }

  protected getMaxInNode(node: Node<T>): Node<T> {

    let right = node.getRight();
    while (right) {
      right = node.getRight();
    }
    return node;
  }
}
