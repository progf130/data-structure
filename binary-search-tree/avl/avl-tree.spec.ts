import {AvlTree} from './avl-tree';


const factory = {
  getTraverseFn: (accumulator: { value: string }) => {
    accumulator.value = '';
    return (value: number) => accumulator.value += value;
  },
  compareFn: (val: number, nodeVal: number) => val - nodeVal,
  balancedArray: [4, 2, 6, 1, 3, 5, 7],
  sortedUpArray: [1, 2, 3, 4, 5, 6, 7],
  sortedDownArray: [7, 6, 5, 4, 3, 2, 1],
  rotateToRight: [4, 2, 5, 1, 3, 0],
  balancedAfterRTR: [2, 1, 4, 0, 3, 5],
  rotateToLeftRight: [4, 1, 5, 0, 2, 3],
  balancedAfterRTLR: [2, 1, 4, 0, 3, 5],
  rotateToLeft: [5, 4, 7, 6, 8, 9],
  balancedAfterRTL: [7, 5, 8, 4, 6, 9],
  rotateToRightLeft: [5, 4, 8, 7, 9, 6],
  balancedAfterRTRL: [7, 5, 8, 4, 6, 9],

  create: (values: number[], useStackInsteadRecursion = false) => {
    const tree = new AvlTree(factory.compareFn, {useStackInsteadRecursion});
    tree.insert(values);
    return tree;
  },
  createBalanced: (useStackInsteadRecursion = false) => {
    const tree = new AvlTree(factory.compareFn, {useStackInsteadRecursion});
    tree.insert(factory.balancedArray);
    return tree;
  },
  createRotateToRight: (useStackInsteadRecursion = false) => {
    const tree = new AvlTree(factory.compareFn, {useStackInsteadRecursion});
    const treeInitialNodes = [...factory.rotateToRight];
    const newNode = treeInitialNodes.pop() as number;
    tree.insert(treeInitialNodes);
    return {tree, treeInitialNodes, newNode};
  },
  createRotateToLeftRight: (useStackInsteadRecursion = false) => {
    const tree = new AvlTree(factory.compareFn, {useStackInsteadRecursion});
    const treeInitialNodes = [...factory.rotateToLeftRight];
    const newNode = treeInitialNodes.pop() as number;
    tree.insert(treeInitialNodes);
    return {tree, treeInitialNodes, newNode};
  },
  createRotateToLeft: (useStackInsteadRecursion = false) => {
    const tree = new AvlTree(factory.compareFn, {useStackInsteadRecursion});
    const treeInitialNodes = [...factory.rotateToLeft];
    const newNode = treeInitialNodes.pop() as number;
    tree.insert(treeInitialNodes);
    return {tree, treeInitialNodes, newNode};
  },
  createRotateToRightLeft: (useStackInsteadRecursion = false) => {
    const tree = new AvlTree(factory.compareFn, {useStackInsteadRecursion});
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

      accumulator = '';
      const stackTree = factory.createBalanced(true);
      stackTree.traverseBFS(traverseFn);
      expect(accumulator).toEqual(factory.balancedArray.join(''));
    });

    it('should traverse dfs in sorted order', () => {

      accumulator = '';
      const tree = factory.createBalanced();
      tree.traverseDFS(traverseFn);
      expect(accumulator).toEqual(factory.sortedUpArray.join(''));

      accumulator = '';
      const stackTree = factory.createBalanced(true);
      stackTree.traverseDFS(traverseFn);
      expect(accumulator).toEqual(factory.sortedUpArray.join(''));
    });

  });

  describe('unbalanced tree', () => {

    it('from sorted array should creating correct tree', () => {

      let accumulator = {value: ''};

      console.log(factory.create([2,1,3], true));
      console.log(factory.create([1,2,3], true));

      factory.create(factory.sortedUpArray)
        .traverseBFS(factory.getTraverseFn(accumulator));
      expect(accumulator.value).toEqual(factory.balancedArray.join(''));

      factory.create(factory.sortedUpArray, true)
        .traverseBFS(factory.getTraverseFn(accumulator));
      expect(accumulator.value).toEqual(factory.balancedArray.join(''));

      factory.create(factory.sortedDownArray)
        .traverseBFS(factory.getTraverseFn(accumulator));
      expect(accumulator.value).toEqual(factory.balancedArray.join(''));

      factory.create(factory.sortedDownArray, true)
        .traverseBFS(factory.getTraverseFn(accumulator));
      expect(accumulator.value).toEqual(factory.balancedArray.join(''));

    });


    describe('when left subtree is longer', () => {

      it('and left\'s left subtree is longer - tree must rotate to right (recursive insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToRight();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        const {tree: stackTree} = factory.createRotateToRight(true);
        stackTree.insert(newNode);
        stackTree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTR.join(''));
      });

      it('and left\'s left subtree is longer - tree must rotate to right (stack insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToRight(true);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insert(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTR.join(''));
      });

      it('and left\'s right subtree is longer - tree must rotate to left-right (recursive insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToLeftRight();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insert(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTLR.join(''));
      });

      it('and left\'s right subtree is longer - tree must rotate to left-right (stack insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToLeftRight(true);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insert(newNode);
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
        tree.insert(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTL.join(''));
      });


      it('and right\'s right subtree is longer - tree must rotate to left (stack insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToLeft(true);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insert(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTL.join(''));
      });

      it('and right\'s left subtree is longer - tree must rotate to right-left (recursive insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToRightLeft();
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(treeInitialNodes.join(''));

        accumulator = '';
        tree.insert(newNode);
        tree.traverseBFS(traverseFn);
        expect(accumulator).toEqual(factory.balancedAfterRTRL.join(''));
      });

      it('and right\'s left subtree is longer - tree must rotate to right-left (stack insert)', () => {

        accumulator = '';
        const {tree, treeInitialNodes, newNode} = factory.createRotateToRightLeft(true);
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
