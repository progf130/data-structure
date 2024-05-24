import {CompareFn, DFS_TYPES, TraverseFn} from '../avl-tree.interface';
import {Tree} from '../avl-tree';
import {Node} from '../node';


export class AvlTree<T> extends Tree<T> {

  constructor(compareFn: CompareFn<T>, ignoreDuplicates = true) {
    super(compareFn, ignoreDuplicates);
  }

  public insert(values: T | T[]) {
    const _values = Array.isArray(values) ? values : [values];
    _values.forEach(value => this.insertValue(value));
  }

  private insertValue(value: T): void {

    type Stack = { direction: keyof Pick<Node<T>, 'left' | 'right'>, node: Node<T> };

    if (!this.root) {
      this.root = new Node(value);
      return;
    }

    const stack: Stack[] = [];
    let curNode: Node<T> | null = this.root;
    while (curNode) {
      const compareResult = this.compareFn(value, curNode.value);
      if (this.ignoreDuplicates && compareResult === 0) {
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

  public traverseDFS(traverseFn: TraverseFn<T>, type?: DFS_TYPES): void {
    switch (type) {
      case DFS_TYPES.PRE_ORDER:
        return this.dfsPreOrder(traverseFn);
      case DFS_TYPES.POST_ORDER:
        return this.dfsPostOrder(traverseFn);
      case DFS_TYPES.IN_ORDER:
      default:
        return this.dfsInOrder(traverseFn);
    }
  }

  private dfsPreOrder(traverseFn: TraverseFn<T>): void {

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

  private dfsInOrder(traverseFn: TraverseFn<T>): void {

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

  private dfsPostOrder(traverseFn: TraverseFn<T>): void {

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

  public override delete(value: T) {
  }

}
