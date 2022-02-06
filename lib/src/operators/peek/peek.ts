import { IntermediateStage } from '../../stages';

class PeekStage<IN> extends IntermediateStage<IN, IN> {
  constructor(private readonly _action: (element: IN) => void) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    this._action(element);
    this._downstream.consume(element, hasMoreDataUpstream);
  }
}

/**
 * Return an intermediate stage that performs an action on each element.
 *
 * @param action The action to perform on each element.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function peek<IN>(action: (element: IN) => void): IntermediateStage<IN, IN> {
  return new PeekStage<IN>(action);
}
