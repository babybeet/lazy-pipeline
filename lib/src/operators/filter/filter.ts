import { IntermediateStage } from '../../stages';

class FilterStage<IN> extends IntermediateStage<IN, IN> {
  constructor(private readonly _predicate: (element: IN) => boolean) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    if (this._predicate(element)) {
      this._downstream.consume(element, hasMoreDataUpstream);
    }
  }
}

/**
 * Return an intermediate stage that filters out elements that do not match the provided predicate.
 *
 * @param predicate
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function filter<IN>(predicate: (element: IN) => boolean): IntermediateStage<IN, IN> {
  return new FilterStage<IN>(predicate);
}
