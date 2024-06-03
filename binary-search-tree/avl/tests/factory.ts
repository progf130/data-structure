import {AvlTree} from '../avl-tree';
import {Tree} from '../../tree';


export type NodeObj = {
  value: number
}

export const factory = {
  traverseFn: (accumulator: { value: string }) => {
    accumulator.value = '';
    return (value: NodeObj) => accumulator.value += accumulator.value === '' ? value.value : `-${value.value}`;
  },
  compareObjFn: (val: NodeObj, nodeVal: NodeObj) => val.value - nodeVal.value,
  wrapToObject: (value: number): { value: number } => ({value}),
  wrapToArrayOfObject: (array: number[]): { value: number }[] => array.map(factory.wrapToObject),
  data: {
    balanced: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15, 0],
    balancedReversed: [7, 3, 11, 1, 5, 9, 13, 0, 2, 4, 6, 8, 10, 12, 14, 15],
    balancedAfterDelete0: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15],
    balancedAfterDelete1: [8, 4, 12, 2, 6, 10, 14, 0, 3, 5, 7, 9, 11, 13, 15],
    balancedAfterDelete3: [8, 4, 12, 1, 6, 10, 14, 0, 2, 5, 7, 9, 11, 13, 15],
    balancedAfterDelete6_7: [8, 2, 12, 1, 4, 10, 14, 0, 3, 5, 9, 11, 13, 15],
    rtr: [4, 2, 5, 1, 3, 0],
    rtrAfterBalancing: [2, 1, 4, 0, 3, 5],
    rtlr: [4, 1, 5, 0, 2, 3],
    rtlrAfterBalancing: [2, 1, 4, 0, 3, 5],
    rtl: [5, 4, 7, 6, 8, 9],
    rtlAfterBalancing: [7, 5, 8, 4, 6, 9],
    rtrl: [5, 4, 8, 7, 9, 6],
    rtrlAfterBalancing: [7, 5, 8, 4, 6, 9],
    deleting: [],
  },
  create: (values: number[], ignoreDuplicates = true): Tree<NodeObj> => {
    let tree: Tree<NodeObj>;
    tree = new AvlTree(factory.compareObjFn, ignoreDuplicates);
    tree.insert(factory.wrapToArrayOfObject(values));
    return tree;
  },
  createForInserting(values: number[]): {
    tree: Tree<NodeObj>,
    treeInitialNodes: number[],
    newNodeVal: number
  } {
    const treeInitialNodes = [...values];
    const newNodeVal = treeInitialNodes.pop() as number;
    let tree: Tree<NodeObj>;
    tree = new AvlTree(factory.compareObjFn);
    tree.insert(factory.wrapToArrayOfObject(treeInitialNodes));
    return {
      tree,
      treeInitialNodes,
      newNodeVal,
    };
  },
};

