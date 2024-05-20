import {AvlTree} from './avl-tree';


const factory = {
  compareFn: (val: number, nodeVal: number) => val - nodeVal,
  balancedArray: [4, 2, 6, 1, 3, 5, 7],
  rotateToRight: [4, 2, 5, 1, 3, 0],
  balancedAfterRTR: [2, 1, 4, 0, 3, 5],
  rotateToLeftRight: [4, 1, 5, 0, 2, 3],
  balancedAfterRTLR: [2, 1, 4, 0, 3, 5],
  rotateToLeft: [5, 4, 7, 6, 8, 9],
  balancedAfterRTL: [7, 5, 8, 4, 6, 9],
  rotateToRightLeft: [5, 4, 8, 7, 9, 6],
  balancedAfterRTRL: [7, 5, 8, 4, 6, 9],
  createBalanced: () => {
    const tree = new AvlTree(factory.compareFn);
    tree.insert(factory.balancedArray);
    return tree;
  },
  createRotateToRight: () => {
    const tree = new AvlTree(factory.compareFn);
    const treeInitialNodes = [...factory.rotateToRight];
    const newNode = treeInitialNodes.pop() as number;
    tree.insert(treeInitialNodes);
    return {tree, treeInitialNodes, newNode};
  },
  createRotateToLeftRight: () => {
    const tree = new AvlTree(factory.compareFn);
    const treeInitialNodes = [...factory.rotateToLeftRight];
    const newNode = treeInitialNodes.pop() as number;
    tree.insert(treeInitialNodes);
    return {tree, treeInitialNodes, newNode};
  },
  createRotateToLeft: () => {
    const tree = new AvlTree(factory.compareFn);
    const treeInitialNodes = [...factory.rotateToLeft];
    const newNode = treeInitialNodes.pop() as number;
    tree.insert(treeInitialNodes);
    return {tree, treeInitialNodes, newNode};
  },
  createRotateToRightLeft: () => {
    const tree = new AvlTree(factory.compareFn);
    const treeInitialNodes = [...factory.rotateToRightLeft];
    const newNode = treeInitialNodes.pop() as number;
    tree.insert(treeInitialNodes);
    return {tree, treeInitialNodes, newNode};
  },
};

describe('Creating', () => {

  let accumulator = '';
  const traverseFn = (val: number) => accumulator += val;

  describe('balanced tree', () => {

    it('should traverse bfs in same order', () => {

      accumulator = '';
      const tree = factory.createBalanced();
      tree.traverseBFS(traverseFn);
      expect(accumulator).toEqual(factory.balancedArray.join(''));
    });

    it('should traverse dfs in sorted order', () => {

      accumulator = '';
      const tree = factory.createBalanced();
      tree.traverseDFS(traverseFn);
      expect(accumulator).toEqual(factory.balancedArray.sort().join(''));
    });

  });

  describe('unbalanced tree', () => {

    describe('when left subtree is longer', () => {

      it('and left\'s left subtree is longer - tree must rotate to right', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToRight();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insert(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTR.join(''));
      });

      it('and left\'s right subtree is longer - tree must rotate to left-right', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToLeftRight();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insert(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTLR.join(''));
      });

    });

    describe('when right subtree is longer', () => {

      it('and right\'s right subtree is longer - tree must rotate to left', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToLeft();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insert(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTL.join(''));
      });

      it('and right\'s left subtree is longer - tree must rotate to right-left', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToRightLeft();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insert(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTRL.join(''));
      });

    });

  });


});
