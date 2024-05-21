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
  insert: (tree: AvlTree<number>, values: number[], recursive: boolean) => {
    if (recursive) {
      tree.insertRecursive(values);
    } else {
      tree.insertUsingStack(values);
    }
  },
  createBalanced: (recursive = true) => {
    const tree = new AvlTree(factory.compareFn);
    factory.insert(tree, factory.balancedArray, recursive);
    return tree;
  },
  createRotateToRight: (recursive = true) => {
    const tree = new AvlTree(factory.compareFn);
    const treeInitialNodes = [...factory.rotateToRight];
    const newNode = treeInitialNodes.pop() as number;
    factory.insert(tree, treeInitialNodes, recursive);
    return {tree, treeInitialNodes, newNode};
  },
  createRotateToLeftRight: (recursive = true) => {
    const tree = new AvlTree(factory.compareFn);
    const treeInitialNodes = [...factory.rotateToLeftRight];
    const newNode = treeInitialNodes.pop() as number;
    factory.insert(tree, treeInitialNodes, recursive);
    return {tree, treeInitialNodes, newNode};
  },
  createRotateToLeft: (recursive = true) => {
    const tree = new AvlTree(factory.compareFn);
    const treeInitialNodes = [...factory.rotateToLeft];
    const newNode = treeInitialNodes.pop() as number;
    factory.insert(tree, treeInitialNodes, recursive);
    return {tree, treeInitialNodes, newNode};
  },
  createRotateToRightLeft: (recursive = true) => {
    const tree = new AvlTree(factory.compareFn);
    const treeInitialNodes = [...factory.rotateToRightLeft];
    const newNode = treeInitialNodes.pop() as number;
    factory.insert(tree, treeInitialNodes, recursive);
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

      accumulator = '';
      const stackTree = factory.createBalanced(false);
      stackTree.traverseBFS(traverseFn);
      expect(accumulator).toEqual(factory.balancedArray.join(''));
    });

    it('should traverse dfs in sorted order', () => {

      accumulator = '';
      const tree = factory.createBalanced();
      tree.traverseDFS(traverseFn);
      expect(accumulator).toEqual(factory.balancedArray.sort().join(''));

      // accumulator = '';
      // const stackTree = factory.createBalanced(false);
      // stackTree.traverseDFS(traverseFn);
      // expect(accumulator).toEqual(factory.balancedArray.sort().join(''));
    });

  });

  describe('unbalanced tree', () => {

    describe('when left subtree is longer', () => {

      it('and left\'s left subtree is longer - tree must rotate to right (recursive insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToRight();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insertRecursive(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTR.join(''));
      });

      it('and left\'s left subtree is longer - tree must rotate to right (stack insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToRight(false);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insertRecursive(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTR.join(''));
      });

      it('and left\'s right subtree is longer - tree must rotate to left-right (recursive insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToLeftRight();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insertRecursive(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTLR.join(''));
      });

      it('and left\'s right subtree is longer - tree must rotate to left-right (stack insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToLeftRight(false);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insertRecursive(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTLR.join(''));
      });

    });

    describe('when right subtree is longer', () => {

      it('and right\'s right subtree is longer - tree must rotate to left (recursive insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToLeft();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insertRecursive(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTL.join(''));
      });

      it('and right\'s right subtree is longer - tree must rotate to left (stack insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToLeft(false);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insertRecursive(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTL.join(''));
      });

      it('and right\'s left subtree is longer - tree must rotate to right-left (recursive insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToRightLeft();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insertRecursive(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTRL.join(''));
      });

      it('and right\'s left subtree is longer - tree must rotate to right-left (stack insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToRightLeft(false);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insertRecursive(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTRL.join(''));
      });

    });

  });


  it('test', () => {
    let arr = [
      1,
      5,
      8,
      11,
      22,
      67,
      4,
      100,
      51,
      24,
      15,
      63,
      33,
      12,
      853,
      654,
      21,
      54,
      84,
      23,
      44,
      9,
      35,
      9,
      342,
      7,
      2,
      79,
      457,
      3,
      42,
      8,
      3,
      1,
      0,
      5,
      96,
      36,
      4,
      7,
      4,
      74,
      6,
      3,
      67,
      96,
      3,
      4,
      647,
      74,
      3,
      5,
      74,
      3,
      4,
      745,
      7,
      3,
      43,
      74,
      5,
      3,
      96,
      3,
      534,
      75,
      3,
      74,
      84,
      5,
      457,
      75,
      3,
      6,
      2,
      8,
      5,
      345,
      3,
      7,
      3,
      43,
      7,
      34,
      978,
      5,
      4,
      756,
      85,
      957,
      34,
      63,
      7,
      0,
      34,
      574,
      7,
      4,
      76,
    ];
    arr = [
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
      ...arr,
    ];
    arr = [...arr, ...arr, ...arr, ...arr, ...arr, ...arr, ...arr];
    arr = [...arr, ...arr, ...arr, ...arr, ...arr, ...arr, ...arr];
    arr = [...arr, ...arr, ...arr, ...arr, ...arr, ...arr, ...arr];
    arr = [...arr, ...arr, ...arr, ...arr, ...arr, ...arr, ...arr];
    arr = [...arr, ...arr, ...arr, ...arr, ...arr, ...arr, ...arr];
    const date1 = new Date();
    const rTree = new AvlTree(factory.compareFn);
    rTree.insertRecursive(arr);
    console.log(new Date().getTime() - date1.getTime());

    const date2 = new Date();
    const sTree = new AvlTree(factory.compareFn);
    sTree.insertUsingStack(arr);
    console.log(new Date().getTime() - date2.getTime());
  });

});
