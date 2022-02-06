import { IntermediateStage } from '../../stages';

class DistinctStage<IN> extends IntermediateStage<IN, IN> {
  private _seenElementMap = new Map<IN, true>();

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    if (!this._seenElementMap.has(element)) {
      this._downstream.consume(element, hasMoreDataUpstream);
      this._seenElementMap.set(element, true);
    }
  }

  override resume(): void {
    this._seenElementMap = new Map();
    super.resume();
  }
}

/**
 * Return an intermediate stage that lets only unique elements pass through.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function distinct<IN>(): IntermediateStage<IN, IN> {
  return new DistinctStage<IN>();
}
