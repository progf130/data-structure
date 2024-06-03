export interface Tree<T> {
  insert(values: T | T[]): void;

  find(value: T): T[];

  traverseDFS(traverseFn: TraverseFn<T>, type?: DFS_TYPES): void;

  traverseBFS(traverseFn: TraverseFn<T>): void;

  getMin(): T | null;

  getMax(): T | null;

  delete(value: T): void;

  includes(value: T): boolean;

  isEmpty(): boolean;

  getMaxHeight(): number;

  print(printFn: PrintFn<T>): void;
}

export type CompareFn<T> = (newValue: T, nodeValue: T) => number;
export type TraverseFn<T> = (nodeValue: T) => void;
export type PrintFn<T> = (nodeValue: T) => string;

export enum DFS_TYPES {
  PRE_ORDER = 'PRE_ORDER',
  IN_ORDER = 'IN_ORDER',
  POST_ORDER = 'POST_ORDER',
}
