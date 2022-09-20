import { IntermediateStage } from '../../stages';
import { PipelineEvent } from '../../PipelineEvent';

class LimitStage<IN> extends IntermediateStage<IN, IN> {
  private _seenElementCount = 0;

  constructor(private readonly _limit: number) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    if (this._seenElementCount < this._limit) {
      this._downstream.consume(element, hasMoreDataUpstream);
      this._seenElementCount++;
    }
    if (this._seenElementCount === this._limit) {
      this._broadcast(PipelineEvent.TERMINATE_PIPELINE);
      this._cascadeEvent(PipelineEvent.TERMINATE_PIPELINE);
    }
  }

  override resume(): void {
    this._seenElementCount = 0;
    super.resume();
  }
}

/**
 * Return an intermediate stage that only allows a fixed number of elements through the pipeline.
 *
 * @param value The number of elements allowed to flow through the pipeline.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function limit<IN>(value: number): IntermediateStage<IN, IN> {
  if (value < 0) {
    throw new Error(
      `[limit() operator] Must be greater than or equal to 0, erroneous pipeline element received was ${value}`
    );
  }
  return new LimitStage<IN>(value);
}
