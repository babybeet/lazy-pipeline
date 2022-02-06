import { IntermediateStage } from '../../stages';

class SortedStage<IN> extends IntermediateStage<IN, IN> {
  private _accumulator: IN[] = [];

  constructor(private readonly _comparator?: (left: IN, right: IN) => number) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    this._accumulator.push(element);

    if (!hasMoreDataUpstream) {
      this._accumulator.sort(this._comparator);

      const totalElementCount = this._accumulator.length;
      for (let index = 0; index < totalElementCount; index++) {
        this._downstream.consume(this._accumulator[index], index !== totalElementCount - 1);
      }
    }
  }

  override resume(): void {
    this._accumulator = [];
    super.resume();
  }
}

/**
 * Return an intermediate stage that sorts the elements in this pipeline. This stage will accumulate all
 * the elements before performing the sort, after that, it will resume the pipeline by sending the
 * sorted elements down the pipeline.
 *
 * If no comparator function is provided, then the sorting behavior is the same as that of
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description Array.prototype.sort}
 * where elements are compared by their character code points, otherwise, sorting behavior is dictated by the
 * provided comparator where a returned value of `-1` indicates that the left element should come before the
 * right element, `1` indicates that the left element should come after the right element, and `0` indicates equality.
 *
 * @param comparator The comparator function to sort by.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function sorted<IN>(comparator?: (left: IN, right: IN) => number): IntermediateStage<IN, IN> {
  return new SortedStage(comparator);
}
