import { TerminalStage } from '../../stages';

class FindLastCollector<IN> extends TerminalStage<IN, IN> {
  private _lastElement: IN;

  override consume(element: IN, hasMoreUpstreamData: boolean): void {
    if (!hasMoreUpstreamData) {
      this._lastElement = element;
    }
  }

  override get(): IN {
    return this._lastElement;
  }
}

/**
 * Return a terminal stage that finds and retrieves the very last element
 * in the pipeline. If no such element exists, `undefined` is returned.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 */
export function findLast<IN>(): TerminalStage<IN, IN> {
  return new FindLastCollector<IN>();
}
