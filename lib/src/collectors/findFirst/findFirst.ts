import { PipelineEvent } from '../../PipelineEvent';
import { TerminalStage } from '../../stages';

class FindFirstCollector<IN> extends TerminalStage<IN, IN> {
  private _firstElement: IN;

  override consume(element: IN): void {
    if (this._firstElement === undefined) {
      this._firstElement = element;
      this.broadcast(PipelineEvent.TERMINATE_EARLY);
    }
  }

  override get(): IN {
    return this._firstElement;
  }
}

/**
 * Return a short-circuiting terminal stage that retrieves the very first element encountered in the pipeline.
 * The pipeline will terminate as soon as an element is found due to its short-circuiting nature, otherwise,
 * `undefined` is returned.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 */
export function findFirst<IN>(): TerminalStage<IN, IN> {
  return new FindFirstCollector<IN>();
}
