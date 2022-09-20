import { PipelineEvent } from '../../PipelineEvent';
import { IntermediateStage } from '../../stages';

class DropWhileStage<IN> extends IntermediateStage<IN, IN> {
  constructor(private readonly _predicate: (element: IN) => boolean) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    const shouldKeepDropping = this._predicate(element);
    if (!shouldKeepDropping) {
      this._downstream.consume(element, hasMoreDataUpstream);
      this._detach();
      this._broadcast(PipelineEvent.STAGE_DETACHED);
    }
  }
}

/**
 * Return an intermediate stage that discards elements from the pipeline as long as the provided predicate is `true`.
 * As soon as the predicate returns `false`, this stage will no longer execute even if the predicate returns `true`
 * for subsequent elements down the pipeline.
 *
 * @param predicate
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function dropWhile<IN>(predicate: (element: IN) => boolean): IntermediateStage<IN, IN> {
  return new DropWhileStage<IN>(predicate);
}
