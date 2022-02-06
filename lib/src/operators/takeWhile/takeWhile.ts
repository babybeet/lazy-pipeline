import { IntermediateStage } from '../../stages';
import { PipelineEvent } from '../../PipelineEvent';

class TakeWhileStage<IN> extends IntermediateStage<IN, IN> {
  constructor(private readonly _predicate: (element: IN) => boolean) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    const shouldKeepTaking = this._predicate(element);
    if (shouldKeepTaking) {
      this._downstream.consume(element, hasMoreDataUpstream);
    } else {
      this.broadcast(PipelineEvent.TERMINATE_EARLY);
    }
  }
}

/**
 * Return an intermediate stage that consumes elements in the pipeline as long as the provided predicate is `true`.
 * As soon as the predicate returns `false`, this stage will no longer execute even if the predicate returns `true`
 * for subsequent elements down the pipeline.
 *
 * @param predicate
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function takeWhile<IN>(predicate: (element: IN) => boolean): IntermediateStage<IN, IN> {
  return new TakeWhileStage<IN>(predicate);
}
