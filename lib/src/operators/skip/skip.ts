import { PipelineEvent } from '../../PipelineEvent';
import { IntermediateStage } from '../../stages';

class SkipStage<IN> extends IntermediateStage<IN, IN> {
  private _skippedElementCount = 0;

  constructor(private readonly _skipCount: number) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    this._skippedElementCount++;
    if (this._skippedElementCount === this._skipCount) {
      this.broadcast(PipelineEvent.DETACH_STAGE);
    } else if (this._skipCount === 0) {
      this._downstream.consume(element, hasMoreDataUpstream);
    }
  }

  override reset(): void {
    this._skippedElementCount = 0;
    super.reset();
  }
}

/**
 * Return an intermediate stage that skips over a fixed number of elements.
 *
 * @param count The number of elements to skip over.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function skip<IN>(count: number): IntermediateStage<IN, IN> {
  if (count < 0) {
    throw new Error(
      `[skip() operator] Must be greater than or equal to 0, erroneous pipeline element received was ${count}`
    );
  }
  return new SkipStage<IN>(count);
}
