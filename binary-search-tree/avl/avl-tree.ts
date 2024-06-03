import {CompareFn, DFS_TYPES, Tree, PrintFn, TraverseFn} from '../tree';
import {Node} from '../node';


export class AvlTree<T> implements Tree<T> {

  private root: Node<T> | null;
  private readonly ignoreDuplicates: boolean;
  private readonly compareFn: CompareFn<T>;

  public constructor(compareFn: CompareFn<T>, ignoreDuplicates = true) {
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

  public getMin(): T | null {
    if (!this.root) {
      return null;
    }

    return this.getMinInNode(this.root).value;
  }

  protected getMinInNode(node: Node<T>): Node<T> {

    let left = node.getLeft();
    return left ? this.getMinInNode(left) : node;
  }

  public getMax(): T | null {
    if (!this.root) {
      return null;
    }

    return this.getMaxInNode(this.root).value;
  }

  protected getMaxInNode(node: Node<T>): Node<T> {

    let right = node.getRight();
    return right ? this.getMaxInNode(right) : node;
  }

  public getMaxHeight(): number {
    return this.root ? this.root.getHeight() : 0;
  }

  public isEmpty(): boolean {
    return this.getMaxHeight() === 0;
  }

  public print(printFn: PrintFn<T>): void {

    if (!this.root) {
      return;
    }
    type N = { node: Node<T>, direction: '' | '<-' | '->', from: string | null };
    const queue: N[] = [{node: this.root, direction: '', from: null}];

    console.log('');
    while (queue.length) {

      const node = queue.shift() as N;
      process.stdout.write(`${node.from ? node.from : ''}${node.direction}${printFn(node.node.value)}  `);
      const left = node.node.getLeft();
      if (left) {
        queue.push({node: left, direction: '<-', from: printFn(node.node.value)});
      }
      const right = node.node.getRight();
      if (right) {
        queue.push({node: right, direction: '->', from: printFn(node.node.value)});
      }
    }

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
    if (compareResult < 0) {
      toNode.setLeft(this.insertValue(value, toNode.getLeft()));
    } else if (compareResult > 0) {
      toNode.setRight(this.insertValue(value, toNode.getRight()));
    } else if (this.ignoreDuplicates) {
      return toNode;
    } else if (this.getBalanceFactor(toNode) < 0) {
      toNode.setLeft(this.insertValue(value, toNode.getLeft()));
    } else {
      toNode.setRight(this.insertValue(value, toNode.getRight()));
    }

    toNode.updateHeight();
    return this.getBalancedRootOfSubtree(toNode);
  }

  public delete(value: T): void {

    if (!this.root) {
      return;
    }

    this.root = this.deleteNode(value, this.root);
  }


  private deleteNode(value: T, fromNode: Node<T> | null, ignoreDuplicates = this.ignoreDuplicates): Node<T> | null {

    if (!fromNode) {
      return null;
    }

    const left = fromNode.getLeft();
    const right = fromNode.getRight();
    const compareResult = this.compareFn(value, fromNode.value);

    if (compareResult === 0) {
      if (!ignoreDuplicates) {
        this.deleteDuplicates(value, fromNode);
      }
      if (left !== null && right !== null) {
        const rightMinNode = this.getMinInNode(right);
        fromNode.value = rightMinNode.value;
        //todo Неправильно т.к. мы устанавливаем правым сразу минимальный, а он может идти через несколько уровней.
        fromNode.setRight(this.deleteNode(rightMinNode.value, right, true));
        return rightMinNode;
      } else if (left === null) {
        fromNode = right;
      } else {
        fromNode = left;
      }
    } else if (compareResult < 0) {
      fromNode.setLeft(this.deleteNode(value, left));
    } else {
      fromNode.setRight(this.deleteNode(value, right));
    }
    if (fromNode) {
      fromNode.updateHeight();
      return this.getBalancedRootOfSubtree(fromNode);
    }
    return fromNode;
  }

  private deleteDuplicates(value: T, fromNode: Node<T>): void {
    const left = fromNode.getLeft();
    const right = fromNode.getRight();
    if (left !== null && this.compareFn(value, left.value) === 0) {
      fromNode.setLeft(this.deleteNode(value, left));
    }
    if (right !== null && this.compareFn(value, right.value) === 0) {
      fromNode.setRight(this.deleteNode(value, right));
    }
  }

  public find(value: T): T[] {
    const results: T[] = [];
    this.findInNode(value, this.root, results, this.ignoreDuplicates);
    return results;
  }

  private findInNode(value: T, inNode: Node<T> | null, results: T[], firstOne: boolean): void {

    if (!inNode) {
      return;
    }

    const compareResult = this.compareFn(value, inNode.value);
    if (compareResult === 0) {
      results.push(inNode.value);
      if (firstOne) {
        return;
      }
      this.findInNode(value, inNode.getLeft(), results, firstOne);
      this.findInNode(value, inNode.getRight(), results, firstOne);
    } else if (compareResult < 0) {
      this.findInNode(value, inNode.getLeft(), results, firstOne);
    } else {
      this.findInNode(value, inNode.getRight(), results, firstOne);
    }
  }

  public traverseDFS(traverseFn: TraverseFn<T>, type?: DFS_TYPES): void {
    switch (type) {
      case DFS_TYPES.PRE_ORDER:
        return this.dfsPreOrder(this.root, traverseFn);
      case DFS_TYPES.POST_ORDER:
        return this.dfsPost(this.root, traverseFn);
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
    this.dfsPreOrder(node.getLeft(), traverseFn);
    this.dfsPreOrder(node.getRight(), traverseFn);
  }

  private dfsInOrder(node: Node<T> | null, traverseFn: TraverseFn<T>): void {
    if (!node) {
      return;
    }
    this.dfsInOrder(node.getLeft(), traverseFn);
    traverseFn(node.value);
    this.dfsInOrder(node.getRight(), traverseFn);
  }

  private dfsPost(node: Node<T> | null, traverseFn: TraverseFn<T>): void {
    if (!node) {
      return;
    }
    this.dfsPost(node.getLeft(), traverseFn);
    this.dfsPost(node.getRight(), traverseFn);
    traverseFn(node.value);
  }

  public includes(value: T): boolean {
    const results: T[] = [];
    this.findInNode(value, this.root, results, true);
    return results.length > 0;
  }

}
