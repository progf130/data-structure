import {Heap} from './heap';


describe('Heap', () => {
  let minHeap: Heap<number>;
  let maxHeap: Heap<number>;

  beforeEach(() => {
    minHeap = new Heap<number>((a, b) => a < b);
    maxHeap = new Heap<number>((a, b) => a > b);
  });

  test('should push and peek the minimum element in minHeap', () => {
    minHeap.pushMany([3, 5, 1, 8, 4]);
    expect(minHeap.peek()).toBe(1);
  });

  test('should push and peek the maximum element in maxHeap', () => {
    maxHeap.pushMany([3, 5, 1, 8, 4]);
    expect(maxHeap.peek()).toBe(8);
  });

  test('should pop elements in correct order (minHeap)', () => {
    const values = [3, 1, 4, 1, 5];
    minHeap.pushMany(values);

    const sorted = [...values].sort((a, b) => a - b);
    const popped = sorted.map(() => minHeap.pop());

    expect(popped).toEqual(sorted);
  });

  test('should pop elements in correct order (maxHeap)', () => {
    const values = [3, 1, 4, 1, 5];
    maxHeap.pushMany(values);

    const sorted = [...values].sort((a, b) => b - a);
    const popped = sorted.map(() => maxHeap.pop());

    expect(popped).toEqual(sorted);
  });

  test('should initialize from array', () => {
    const elements = [10, 20, 5];
    const heap = new Heap<number>((a, b) => a < b, elements);
    expect(heap.pop()).toBe(5);
    expect(heap.pop()).toBe(10);
    expect(heap.pop()).toBe(20);
  });

  test('should handle pop on empty heap gracefully', () => {
    expect(minHeap.pop()).toBeUndefined();
  });

  test('should clear the heap', () => {
    minHeap.push(1);
    minHeap.push(2);
    minHeap.clear();

    expect(minHeap.isEmpty()).toBeTruthy()
    expect(minHeap.pop()).toBeUndefined();
  });

  test('should return correct size and isEmpty', () => {
    expect(minHeap.size()).toBe(0);
    minHeap.push(1);
    expect(minHeap.size()).toBe(1);
    minHeap.pop();
    expect(minHeap.size()).toBe(0);
    expect(minHeap.isEmpty()).toBeTruthy()
  });

});
