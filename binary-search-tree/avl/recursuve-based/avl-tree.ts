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
    if (this.ignoreDuplicates && compareResult === 0) {
      return toNode;
    } else if (compareResult < 0) {
      toNode.left = this.insertValue(value, toNode.left);
    } else {
      toNode.right = this.insertValue(value, toNode.right);
    }

    toNode.updateHeight();
    return this.getBalancedRootOfSubtree(toNode);
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

  private dfsPost(node: Node<T> | null, traverseFn: TraverseFn<T>): void {
    if (!node) {
      return;
    }
    this.dfsPost(node.left, traverseFn);
    this.dfsPost(node.right, traverseFn);
    traverseFn(node.value);
  }

  public delete(value: T): void {

    if (!this.root) {
      return;
    }

    this.root = this.deleteNode(value, this.root);
  }


  private deleteNode(value: T, fromNode: Node<T>): Node<T> | null {

    if (!fromNode) {
      return null;
    }

    const compareResult = this.compareFn(value, fromNode.value);

    if (compareResult === 0) {

    } else if (compareResult < 0) {
      fromNode.left = this.deleteNode(value, fromNode);
    } else {
      fromNode.left = this.deleteNode(value, fromNode);
    }


    return {} as Node<T>;
  }

}