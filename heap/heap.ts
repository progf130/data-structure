export type CompareFn<T> = (cur: T, rel: T) => boolean;

export class Heap<T> {

  private data: T[] = [];
  private readonly compareFn: CompareFn<T>;

  constructor(compareFn: CompareFn<T>, elements?: T[]) {
    this.compareFn = compareFn;
    this.init(elements);
  }

  private init(elements?: T[]) {
    if (elements?.length) {
      for (const element of elements) {
        this.push(element);
      }
    }
  }

  public size() {
    return this.data.length;
  }

  public isEmpty(): boolean {
    return this.size() === 0;
  }

  public clear() {
    this.data = [];
  }

  public peek(): T | undefined {
    return this.data[0];
  }

  public push(value: T): void {
    this.data.push(value);
    this.heapUp();
  }

  public pushMany(values: T[]) {
    for (const value of values) {
      this.data.push(value);
      this.heapUp();
    }
  }

  private heapUp(): void {
    let currentIndex = this.size() - 1;
    while (currentIndex > 0) {
      const parentIndex = this.getParentIndex(currentIndex);
      if (!this.swap(currentIndex, parentIndex)) {
        break;
      }
      currentIndex = parentIndex;
    }
  }

  private swap(currentIndex: number, parentIndex: number): boolean {
    if (this.compareFn(this.data[currentIndex]!, this.data[parentIndex]!)) {
      [this.data[currentIndex], this.data[parentIndex]] = [this.data[parentIndex]!, this.data[currentIndex]!];
      return true;
    }
    return false;
  }

  private getParentIndex(i: number) {
    return Math.floor((i - 1) / 2);
  }

  public pop(): T | undefined {
    const top = this.peek();
    const end = this.data.pop();
    if (this.size() > 0 && end !== undefined) {
      this.data[0] = end;
      this.heapDown();
    }
    return top;
  }


  private heapDown(): void {
    let currentIndex = 0;
    const heapSize = this.size();

    while (true) {
      const {leftIndex, rightIndex} = this.getChildrenIndices(currentIndex);
      let indexToSwap: number | undefined;

      if (leftIndex < heapSize && this.compareFn(this.data[leftIndex]!, this.data[currentIndex]!)) {
        indexToSwap = leftIndex;
      }
      if (rightIndex < heapSize && this.compareFn(this.data[rightIndex]!, this.data[currentIndex]!) &&
        (!indexToSwap || this.compareFn(this.data[rightIndex]!, this.data[leftIndex]!))) {
        indexToSwap = rightIndex;
      }


      if (indexToSwap === undefined) {
        break;
      }

      [this.data[currentIndex], this.data[indexToSwap]] = [this.data[indexToSwap]!, this.data[currentIndex]!];
      currentIndex = indexToSwap;
    }
  }

  private getChildrenIndices(i: number): { leftIndex: number, rightIndex: number } {
    return {leftIndex: 2 * i + 1, rightIndex: 2 * i + 2};
  }

}
