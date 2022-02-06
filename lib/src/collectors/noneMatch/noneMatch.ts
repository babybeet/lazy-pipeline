import { PipelineEvent } from '../../PipelineEvent';
import { TerminalStage } from '../../stages';

class NoneMatchCollector<IN> extends TerminalStage<IN, boolean> {
  private _noneMatch = true;

  constructor(private readonly _predicate: (element: IN) => boolean) {
    super();
  }

  override consume(element: IN): void {
    this._noneMatch = !this._predicate(element);
    if (!this._noneMatch) {
      this.broadcast(PipelineEvent.TERMINATE_EARLY);
    }
  }

  override get(): boolean {
    return this._noneMatch;
  }
}

/**
 * Return a terminal stage that checks whether no elements in this pipeline match the provided predicate.
 *
 * @param predicate The predicate used to test if no elements of the pipeline match.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function noneMatch<IN>(predicate: (element: IN) => boolean): TerminalStage<IN, boolean> {
  return new NoneMatchCollector<IN>(predicate);
}
