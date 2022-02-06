import { PipelineEvent } from '../../PipelineEvent';
import { TerminalStage } from '../../stages';

class AnyMatchCollector<IN> extends TerminalStage<IN, boolean> {
  private _anyMatch = false;

  constructor(private readonly _predicate: (element: IN) => boolean) {
    super();
  }

  override consume(element: IN): void {
    this._anyMatch = this._predicate(element);
    if (this._anyMatch) {
      this.broadcast(PipelineEvent.TERMINATE_EARLY);
    }
  }

  override get(): boolean {
    return this._anyMatch;
  }

  override resume(): void {
    this._anyMatch = false;
  }
}

/**
 * Return a terminal stage that evaluates whether at least one element in the pipeline matches the provided predicate.
 *
 * @param predicate
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function anyMatch<IN>(predicate: (element: IN) => boolean): TerminalStage<IN, boolean> {
  return new AnyMatchCollector<IN>(predicate);
}
