import { TerminalStage } from '../../stages';

class AverageCollector<IN extends number> extends TerminalStage<IN, number> {
  private _sum = 0;
  private _totalElement = 0;

  override consume(element: IN): void {
    this._throwErrorIfNotNumber(element);
    this._sum += element;
    this._totalElement++;
  }

  private _throwErrorIfNotNumber(value: unknown) {
    if (typeof value !== 'number') {
      throw new Error(
        `[average() collector] Numbers expected, erroneous pipeline element received was ${JSON.stringify(value)}`
      );
    }
  }

  override get(): number {
    if (this._totalElement > 0) {
      return this._sum / this._totalElement;
    }
    throw new Error('[average() collector] Pipeline contains 0 elements');
  }
}

/**
 * Return a terminal stage that calculates the average of all numeric elements in the pipeline.
 * This collector throws an error if at least one element is not numeric.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 */
export function average<IN extends number>(): TerminalStage<IN, number> {
  return new AverageCollector<IN>();
}
