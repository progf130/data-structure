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
      toNode.setLeft(this.insertValue(value, toNode.getLeft()));
    } else {
      toNode.setRight(this.insertValue(value, toNode.getRight()));
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

  public delete(value: T): void {

    if (!this.root) {
      return;
    }

    this.root = this.deleteNode(value, this.root);
  }


  private deleteNode(value: T, fromNode: Node<T> | null): Node<T> | null {

    if (!fromNode) {
      return null;
    }

    const left = fromNode.getLeft();
    const right = fromNode.getRight();

    const compareResult = this.compareFn(value, fromNode.value);

    if (compareResult === 0) {
      if (left !== null && right !== null) {
        const rightMinNode = this.getMinInNode(left);
        const parent = rightMinNode.getParent() as Node<T>;

        return rightMinNode;
      }


      if ((root.left === null) || (root.right === null)) {
        let temp = null;
        if (temp == root.left) {
          temp = root.right;
        } else {
          temp = root.left;
        }

        if (temp == null) {
          temp = root;
          root = null;
        } else {
          root = temp;
        }
      } else {
        let temp = this.nodeWithMimumValue(root.right);
        root.item = temp.item;
        root.right = deleteNodeHelper(root.right, temp.item);
      }


    } else if (compareResult < 0) {
      fromNode.setLeft(this.deleteNode(value, left));
    } else {
      fromNode.setRight(this.deleteNode(value, right));
    }

    return {} as Node<T>;
  }

}
