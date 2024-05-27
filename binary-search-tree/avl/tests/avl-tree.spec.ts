import {factory, NodeObj} from './factory';
import {IAvlTree} from '../avl-tree.interface';


const types = ['recursive', 'stack'] as const;
let accumulator = {value: ''};

types.forEach(type => {
  describe(`In ${type}-tree`, () => {

    describe('Creating', () => {

      describe('empty tree', () => {

        it('must return isEmpty = true', () => {
          expect(factory.create([], type).isEmpty()).toBeTruthy();
        });
      });

      describe('not empty tree', () => {

        it('must return isEmpty = false', () => {
          expect(factory.create([1, 2, 3], type).isEmpty()).toBeFalsy();
        });

        it('Max height of the tree must be log2(N+1)', () => {
          const arrayOf7 = [1, 2, 3, 4, 5, 6, 7];
          const addingTo16 = [8, 9, 10, 11, 12, 13, 14, 15, 16];
          const tree = factory.create(arrayOf7, type);
          expect(tree.getMaxHeight()).toEqual(Math.ceil(Math.log2(arrayOf7.length + 1)));
          tree.insert(factory.wrapToArrayOfObject(addingTo16));
          expect(tree.getMaxHeight()).toEqual(Math.ceil(Math.log2([...arrayOf7, ...addingTo16].length + 1)));

          const arrayOf7WithDuplicates = [1, 2, 3, 4, 7, 7, 7];
          const addingTo16WithDuplicates = [8, 8, 10, 11, 11, 13, 14, 15, 16];
          const treeWithDuplicates = factory.create(arrayOf7WithDuplicates, type, false);
          expect(treeWithDuplicates.getMaxHeight()).toEqual(Math.ceil(Math.log2(arrayOf7WithDuplicates.length + 1)));
          treeWithDuplicates.insert(factory.wrapToArrayOfObject(addingTo16WithDuplicates));
          expect(treeWithDuplicates.getMaxHeight())
            .toEqual(Math.ceil(Math.log2([...arrayOf7WithDuplicates, ...addingTo16WithDuplicates].length + 1)));
        });
      });

      describe('balanced tree', () => {

        it('should traverse bfs in same order', () => {

          factory.create(factory.data.balanced, type)
            .traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.balanced.join('-'));
        });

        it('should traverse dfs in sorted order', () => {

          factory.create(factory.data.balanced, type)
            .traverseDFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual([...factory.data.balanced].sort((a, b) => a - b).join('-'));
        });
      });

      describe('unbalanced tree', () => {

        it('from sorted array should creating correct tree', () => {

          factory.create([...factory.data.balanced].sort((a, b) => b - a), type)
            .traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.balanced.join('-'));

          factory.create([...factory.data.balanced].sort((a, b) => a - b), type)
            .traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.balancedReversed.join('-'));

        });
      });

      describe('when left subtree is longer', () => {

        let tree: IAvlTree<NodeObj>;
        let treeInitialNodes: number[];
        let newNodeVal: number;

        it('and left\'s left subtree is longer - tree must rotate to right', () => {

          ({tree, treeInitialNodes, newNodeVal} = factory.createForInserting(factory.data.rtr, type));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(treeInitialNodes.join('-'));
          tree.insert(factory.wrapToObject(newNodeVal));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.rtrAfterBalancing.join('-'));
        });

        it('and left\'s right subtree is longer - tree must rotate to left-right', () => {

          ({tree, treeInitialNodes, newNodeVal} = factory.createForInserting(factory.data.rtlr, type));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(treeInitialNodes.join('-'));
          tree.insert(factory.wrapToObject(newNodeVal));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.rtlrAfterBalancing.join('-'));
        });
      });

      describe('when right subtree is longer', () => {

        let tree: IAvlTree<NodeObj>;
        let treeInitialNodes: number[];
        let newNodeVal: number;

        it('and right\'s right subtree is longer - tree must rotate to left', () => {

          ({tree, treeInitialNodes, newNodeVal} = factory.createForInserting(factory.data.rtl, type));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(treeInitialNodes.join('-'));
          tree.insert(factory.wrapToObject(newNodeVal));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.rtlAfterBalancing.join('-'));
        });

        it('and right\'s left subtree is longer - tree must rotate to right-left', () => {

          ({tree, treeInitialNodes, newNodeVal} = factory.createForInserting(factory.data.rtrl, type));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(treeInitialNodes.join('-'));
          tree.insert(factory.wrapToObject(newNodeVal));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.rtrlAfterBalancing.join('-'));
        });
      });
    });

    describe('Searching', () => {

      const array = [2, 2, 100, 100, 100, 4, 1, 7, 3];

      describe('Must correctly return result of find and includes method', () => {

        it('in no-duplicate tree', () => {
          const tree = factory.create(array, type);
          expect(tree.find(factory.wrapToObject(100)).length).toEqual(1);
          expect(tree.includes(factory.wrapToObject(100))).toBeTruthy();
          expect(tree.find(factory.wrapToObject(101)).length).toEqual(0);
          expect(tree.includes(factory.wrapToObject(101))).toBeFalsy();
        });

        it('in array with duplicates', () => {
          const tree = factory.create(array, type, false);
          expect(tree.find(factory.wrapToObject(100)).length).toEqual(3);
          expect(tree.includes(factory.wrapToObject(100))).toBeTruthy();
          expect(tree.find(factory.wrapToObject(101)).length).toEqual(0);
          expect(tree.includes(factory.wrapToObject(101))).toBeFalsy();
        });
      });

      describe('Must correctly return minimum and maximum value', () => {


        it('in no-duplicate tree', () => {
          const tree = factory.create(array, type);
          expect(tree.getMin()?.value).toEqual(1);
          expect(tree.getMax()?.value).toEqual(100);
        });

        it('in array with duplicates', () => {
          const tree = factory.create(array, type, false);
          expect(tree.getMin()?.value).toEqual(1);
          expect(tree.getMax()?.value).toEqual(100);
        });
      });
    });

    describe('Deleting', () => {

      describe('in no-duplicate tree', () => {

        it('element with no children', () => {
          const tree = factory.create(factory.data.balanced, type);
          tree.delete(factory.wrapToObject(0));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.balancedAfterDelete0.join('-'));
        });

        it('element with one children', () => {
          const tree = factory.create(factory.data.balanced, type);
          tree.delete(factory.wrapToObject(1));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.balancedAfterDelete1.join('-'));
        });

        it('element with one children need to rotate', () => {
          const tree = factory.create(factory.data.balanced, type);
          tree.delete(factory.wrapToObject(3));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.balancedAfterDelete3.join('-'));
        });

        it('element with two children need to rotate', () => {
          const tree = factory.create(factory.data.balanced, type);
          tree.print((it) => `${it.value}`);

          tree.delete(factory.wrapToObject(6));
          tree.print((it) => `${it.value}`);

          tree.delete(factory.wrapToObject(7));
          tree.traverseBFS(factory.traverseFn(accumulator));
          expect(accumulator.value).toEqual(factory.data.balancedAfterDelete6_7.join('-'));
        });
      });
    });
  });
});


