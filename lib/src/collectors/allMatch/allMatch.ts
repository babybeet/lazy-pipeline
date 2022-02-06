import { PipelineEvent } from '../../PipelineEvent';
import { TerminalStage } from '../../stages';

class AllMatchCollector<IN> extends TerminalStage<IN, boolean> {
  private _allMatch = true;

  constructor(private readonly _predicate: (element: IN) => boolean) {
    super();
  }

  override consume(element: IN): void {
    this._allMatch = this._predicate(element);
    if (!this._allMatch) {
      this.broadcast(PipelineEvent.TERMINATE_EARLY);
    }
  }

  override get(): boolean {
    return this._allMatch;
  }

  override resume(): void {
    this._allMatch = true;
  }
}

/**
 * Return a terminal stage that evaluates whether all elements in the pipeline match the provided predicate.
 *
 * @param predicate
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 *
 */
export function allMatch<IN>(predicate: (element: IN) => boolean): TerminalStage<IN, boolean> {
  return new AllMatchCollector<IN>(predicate);
}
