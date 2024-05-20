import {AvlTree} from './avl-tree';


const factory = {
  compareFn: (val: number, nodeVal: number) => val - nodeVal,
  balancedArray: [4, 2, 6, 1, 3, 5, 7],
  creatBalanced: () => {
    const tree = new AvlTree(factory.compareFn);
    tree.insert(factory.balancedArray);
    return tree;
  },
};

describe('Creating', () => {

  describe('balanced tree', () => {

    it('should traverse bfs in same order', () => {
      let accumulator = '';
      const traverseFn = (val: number) => accumulator += val;
      const tree = factory.creatBalanced();
      tree.traverseBFS(traverseFn);
      expect(accumulator).toEqual(factory.balancedArray.join(''));
    });

    it('should traverse dfs in sorted order', () => {
      let accumulator = '';
      const traverseFn = (val: number) => accumulator += val;
      const tree = factory.creatBalanced();
      tree.traverseDFS(traverseFn);
      expect(accumulator).toEqual(factory.balancedArray.sort().join(''));
    });

  });


});
