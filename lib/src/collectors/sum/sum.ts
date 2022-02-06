import { TerminalStage } from '../../stages';

class SumCollector<IN extends number> extends TerminalStage<IN, number> {
  private _sum = 0;

  override consume(element: IN): void {
    this._throwErrorIfNotNumber(element);
    this._sum += element;
  }

  private _throwErrorIfNotNumber(value: unknown) {
    if (typeof value !== 'number') {
      throw new Error(
        `[sum() collector] Numbers expected, erroneous pipeline element received was ${JSON.stringify(value)}`
      );
    }
  }

  override get(): number {
    return this._sum;
  }
}

/**
 * Return a terminal stage that calculates the sum of all elements in this pipeline. It assumes that every element
 * is numeric, otherwise, it will throw an error when at least one element is not numeric.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function sum<IN extends number>(): TerminalStage<IN, number> {
  return new SumCollector<IN>();
}
