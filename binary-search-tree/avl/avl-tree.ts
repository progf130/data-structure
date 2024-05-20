import {Node} from './node';


type CompareFn<T> = (newValue: T, nodeValue: T) => number;

type TraverseFn<T> = (nodeValue: T) => void;

enum DFS_TYPES {
  PRE_ORDER = 'PRE_ORDER',
  IN_ORDER = 'IN_ORDER',
  POST_ORDER = 'POST_ORDER',
}

type Options = {
  ignoreDuplicates?: boolean
}

const DEFAULT_OPTIONS: Options = {
  ignoreDuplicates: true,
};

export class AvlTree<T> {

  private root: Node<T> | null;
  private readonly options: Options;
  private readonly compareFn: CompareFn<T>;

  /**
   * @param compareFn - Used when adding elements to a tree. Must return a negative number if new value is less than node
   * value, zero if equal, a positive number if new value is greater than node value
   * @param [options] - optional settings
   * @param {boolean} [options.ignoreDuplicates=true] - if true does not insert duplicate values
   */
  constructor(compareFn: CompareFn<T>, options?: Options) {
    this.compareFn = compareFn;
    this.root = null;
    this.options = {...DEFAULT_OPTIONS, ...options};
  }

  public insert(values: T | T[]) {
    const _values = Array.isArray(values) ? values : [values];

    _values.forEach(value => this.root = this.insertValue(value, this.root));
  }

  private insertValue(value: T, toNode: Node<T> | null): Node<T> {

    if (!toNode) {
      return new Node(value);
    }

    const compareResult = this.compareFn(value, toNode.value);
    if (this.options.ignoreDuplicates && compareResult === 0) {
      return toNode;
    } else if (compareResult < 0) {
      toNode.left = this.insertValue(value, toNode.left);
    } else {
      toNode.right = this.insertValue(value, toNode.right);
    }

    toNode.updateHeight();

    return toNode;
  }

  public traverseDFS(traverseFn: TraverseFn<T>, type?: DFS_TYPES): void {
    switch (type) {
      case DFS_TYPES.PRE_ORDER:
        return this.dfsPreOrder(this.root, traverseFn);
      case DFS_TYPES.POST_ORDER:
        return this.dfsPostOrder(this.root, traverseFn);
      case DFS_TYPES.IN_ORDER:
      default:
        return this.dfsInOrder(this.root, traverseFn);
    }
  }

  private dfsPreOrder(node: Node<T> | null, traverseFn: TraverseFn<T>): void {
    if (!node) {
      return;
    }
    traverseFn(node.value);
    this.dfsPreOrder(node.left, traverseFn);
    this.dfsPreOrder(node.right, traverseFn);
  }

  private dfsInOrder(node: Node<T> | null, traverseFn: TraverseFn<T>): void {
    if (!node) {
      return;
    }
    this.dfsInOrder(node.left, traverseFn);
    traverseFn(node.value);
    this.dfsInOrder(node.right, traverseFn);
  }

  private dfsPostOrder(node: Node<T> | null, traverseFn: TraverseFn<T>): void {
    if (!node) {
      return;
    }
    this.dfsPostOrder(node.left, traverseFn);
    this.dfsPostOrder(node.right, traverseFn);
    traverseFn(node.value);
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

}
