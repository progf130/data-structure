import {Node} from './node';


type CompareFn<T> = (newValue: T, nodeValue: T) => number;

interface IAvlTree<T> {

  insert(values: T | [T]): void;

  traverseDFS(traverseFn: TraverseFn<T>, type?: DFS_TYPES): void;

  traverseBFS(traverseFn: TraverseFn<T>): void;

  find(value: T): T;

  findAll(value: T): T[];

  getMin(): T;

  getMax(): T;

  delete(value: T): void;
}

type TraverseFn<T> = (nodeValue: T) => void;

enum DFS_TYPES {
  PRE_ORDER = 'PRE_ORDER',
  IN_ORDER = 'IN_ORDER',
  POST_ORDER = 'POST_ORDER',
}

type Options = {
  ignoreDuplicates?: boolean,
  useStackInsteadRecursion?: boolean,
}

const DEFAULT_OPTIONS: Options = {
  ignoreDuplicates: true,
  useStackInsteadRecursion: false,
};

export class AvlTree<T> implements IAvlTree<T> {

  private root: Node<T> | null;
  private readonly options: Options;
  private readonly compareFn: CompareFn<T>;

  /**
   * @param compareFn - Used when adding elements to a tree. Must return a negative number if new value is less than node
   * value, zero if equal, a positive number if new value is greater than node value
   * @param [options] - optional settings
   * @param {boolean} [options.ignoreDuplicates=true] - if true does not insert duplicate values
   * @param {boolean} [options.useStackInsteadRecursion=false] - if true uses stack when insert values or traverse tree. Used if
   * a call stack overflow error occurs
   */
  constructor(compareFn: CompareFn<T>, options?: Options) {
    this.compareFn = compareFn;
    this.root = null;
    this.options = {...DEFAULT_OPTIONS, ...options};
  }

  public insert(values: T | T[]) {
    const _values = Array.isArray(values) ? values : [values];
    if (this.options.useStackInsteadRecursion) {
      _values.forEach(value => this.insertValueUsingStack(value));
    } else {
      _values.forEach(value => this.root = this.insertValueRecursive(value, this.root));
    }
  }

  private insertValueRecursive(value: T, toNode: Node<T> | null): Node<T> {

    if (!toNode) {
      return new Node(value);
    }

    const compareResult = this.compareFn(value, toNode.value);
    if (this.options.ignoreDuplicates && compareResult === 0) {
      return toNode;
    } else if (compareResult < 0) {
      toNode.left = this.insertValueRecursive(value, toNode.left);
    } else {
      toNode.right = this.insertValueRecursive(value, toNode.right);
    }

    toNode.updateHeight();
    return this.getBalancedRootOfSubtree(toNode);
  }

  private insertValueUsingStack(value: T): void {

    type Stack = { direction: keyof Pick<Node<T>, 'left' | 'right'>, node: Node<T> };

    if (!this.root) {
      this.root = new Node(value);
      return;
    }

    const stack: Stack[] = [];
    let curNode: Node<T> | null = this.root;
    while (curNode) {
      const compareResult = this.compareFn(value, curNode.value);
      if (this.options.ignoreDuplicates && compareResult === 0) {
        return;
      } else if (compareResult < 0) {
        stack.push({direction: 'left', node: curNode});
        curNode = curNode.left;
      } else {
        stack.push({direction: 'right', node: curNode});
        curNode = curNode.right;
      }
    }

    let newNode = new Node(value);
    while (stack.length) {
      const {node, direction} = stack.pop() as Stack;
      node[direction] = newNode;
      node.updateHeight();
      //todo complete bug
      newNode = this.getBalancedRootOfSubtree(node);
    }
  }

  private getBalancedRootOfSubtree(node: Node<T>): Node<T> {
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

  private getBalanceFactor(node: Node<T>): number {
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

  public traverseDFS(traverseFn: TraverseFn<T>, type?: DFS_TYPES): void {
    switch (type) {
      case DFS_TYPES.PRE_ORDER:
        if (this.options.useStackInsteadRecursion) {
          return this.dfsPreOrderUsingStack(traverseFn);
        }
        return this.dfsPreOrderRecursive(this.root, traverseFn);
      case DFS_TYPES.POST_ORDER:
        if (this.options.useStackInsteadRecursion) {
          return this.dfsPostOrderUsingStack(traverseFn);
        }
        return this.dfsPostOrderRecursive(this.root, traverseFn);
      case DFS_TYPES.IN_ORDER:
      default:
        if (this.options.useStackInsteadRecursion) {
          return this.dfsInOrderUsingStack(traverseFn);
        }
        return this.dfsInOrderRecursive(this.root, traverseFn);
    }
  }

  private dfsPreOrderRecursive(node: Node<T> | null, traverseFn: TraverseFn<T>): void {
    if (!node) {
      return;
    }
    traverseFn(node.value);
    this.dfsPreOrderRecursive(node.left, traverseFn);
    this.dfsPreOrderRecursive(node.right, traverseFn);
  }

  private dfsPreOrderUsingStack(traverseFn: TraverseFn<T>): void {

    if (!this.root) {
      return;
    }

    const stack = [this.root];
    while (stack.length) {
      const node = stack.pop() as Node<T>;
      traverseFn(node.value);
      if (node.right) {
        stack.push(node.right);
      }
      if (node.left) {
        stack.push(node.left);
      }
    }
  }

  private dfsInOrderRecursive(node: Node<T> | null, traverseFn: TraverseFn<T>): void {
    if (!node) {
      return;
    }
    this.dfsInOrderRecursive(node.left, traverseFn);
    traverseFn(node.value);
    this.dfsInOrderRecursive(node.right, traverseFn);
  }

  private dfsInOrderUsingStack(traverseFn: TraverseFn<T>): void {

    if (!this.root) {
      return;
    }

    const stack: Node<T>[] = [];
    let currentNode: Node<T> | null = this.root;
    while (stack.length || currentNode) {

      while (currentNode) {
        stack.push(currentNode);
        currentNode = currentNode.left;
      }

      currentNode = stack.pop() as Node<T>;
      traverseFn(currentNode.value);
      currentNode = currentNode.right;
    }
  }

  private dfsPostOrderRecursive(node: Node<T> | null, traverseFn: TraverseFn<T>): void {
    if (!node) {
      return;
    }
    this.dfsPostOrderRecursive(node.left, traverseFn);
    this.dfsPostOrderRecursive(node.right, traverseFn);
    traverseFn(node.value);
  }

  private dfsPostOrderUsingStack(traverseFn: TraverseFn<T>): void {

    if (!this.root) {
      return;
    }

    const stack: Node<T>[] = [this.root];
    const postStack: Node<T>[] = [];

    while (stack.length) {
      const node = stack.pop() as Node<T>;
      if (node.left) {
        stack.push(node.left);
      }
      if (node.right) {
        stack.push(node.right);
      }
      postStack.push(node);
    }

    while (postStack.length) {
      traverseFn((postStack.pop() as Node<T>).value);
    }
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

  public delete(value: T): void {

    if (!this.root) {
      return;
    }

    this.root = this.deleteNodeRecursive(value, this.root);
  }


  private deleteNodeRecursive(value: T, fromNode: Node<T>): Node<T> {

    if (!fromNode) {

    }

    const compareResult = this.compareFn(value, fromNode.value);

    if (compareResult === 0) {

    } else if (compareResult < 0) {
      fromNode.left = this.deleteNodeRecursive(value, fromNode);
    } else {
      fromNode.left = this.deleteNodeRecursive(value, fromNode);
    }
  }

}
