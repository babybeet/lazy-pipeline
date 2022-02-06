import { IntermediateStage } from '../../stages';

class DistinctByStage<IN, OUT> extends IntermediateStage<IN, IN> {
  private _seenElementMap = new Map<OUT, true>();

  constructor(private readonly _mapper: (element: IN) => OUT) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    const distinctByElement = this._mapper(element);
    if (!this._seenElementMap.has(distinctByElement)) {
      this._downstream.consume(element, hasMoreDataUpstream);
      this._seenElementMap.set(distinctByElement, true);
    }
  }

  override resume(): void {
    this._seenElementMap = new Map();
    super.resume();
  }
}

/**
 * Return an intermediate stage that lets only unique elements pass through, uniqueness is decided by the provided mapper function.
 *
 * @param mapper The function used to get the value to use for uniqueness evaluation.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function distinctBy<IN, OUT>(mapper: (element: IN) => OUT): IntermediateStage<IN, IN> {
  return new DistinctByStage<IN, OUT>(mapper);
}
