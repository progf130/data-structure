import {CompareFn, DFS_TYPES, TraverseFn} from '../avl-tree.interface';
import {Tree} from '../avl-tree';
import {Node} from '../node';


export class AvlTree<T> extends Tree<T> {

  constructor(compareFn: CompareFn<T>, ignoreDuplicates = true) {
    super(compareFn, ignoreDuplicates);
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
        fromNode.setRight(this.deleteNode(rightMinNode.value, rightMinNode, true));
        return rightMinNode;
      } else if (left === null) {
        fromNode = right;
        // fromNode.setRight(right);
      } else {
        fromNode = left;
        // fromNode.setRight(left);
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
