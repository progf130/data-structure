export interface IAvlTree<T> {
  insert(values: T | T[]): void;

  find(value: T): T[];

  traverseDFS(traverseFn: TraverseFn<T>, type?: DFS_TYPES): void;

  traverseBFS(traverseFn: TraverseFn<T>): void;

  getMin(): T | null;

  getMax(): T | null;

  delete(value: T): void;
}

export type CompareFn<T> = (newValue: T, nodeValue: T) => number;
export type TraverseFn<T> = (nodeValue: T) => void;

export enum DFS_TYPES {
  PRE_ORDER = 'PRE_ORDER',
  IN_ORDER = 'IN_ORDER',
  POST_ORDER = 'POST_ORDER',
}
