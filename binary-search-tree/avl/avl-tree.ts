import {CompareFn, DFS_TYPES, IAvlTree, TraverseFn} from './avl-tree.interface';
import {Node} from './node';


export abstract class Tree<T> implements IAvlTree<T>{

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
      const left = node.left as Node<T>;
      if (this.getBalanceFactor(left) >= 0) {
        return this.rotateToRight(node);
      } else {
        node.left = this.rotateToLeft(left);
        return this.rotateToRight(node);
      }
    }
    if (balanceFactor < -1) {
      const right = node.right as Node<T>;
      if (this.getBalanceFactor(right) <= 0) {
        return this.rotateToLeft(node);
      } else {
        node.right = this.rotateToRight(right);
        return this.rotateToLeft(node);
      }
    }
    return node;
  }

  protected getBalanceFactor(node: Node<T>): number {
    const leftHeight = node.left?.getHeight() ?? 0;
    const rightHeight = node.right?.getHeight() ?? 0;
    return leftHeight - rightHeight;
  }

  /**
   * Used to rotate subtree to the left, returns root node of new subtree
   * @param node
   * @private
   */
  private rotateToLeft(node: Node<T>): Node<T> {
    const nodeRight = node.right as Node<T>;
    node.right = nodeRight.left ?? null;
    nodeRight.left = node;
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
    const nodeLeft = node.left as Node<T>;
    node.left = nodeLeft.right ?? null;
    nodeLeft.right = node;
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
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
  }


  public abstract insert(values: T | T[]): void;

  public abstract traverseDFS(traverseFn: TraverseFn<T>, type?: DFS_TYPES): void;

  public abstract delete(value: T): void;


}
