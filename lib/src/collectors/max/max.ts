import { TerminalStage } from '../../stages';

class MaxCollector<IN> extends TerminalStage<IN, IN> {
  private _max: IN;

  constructor(private readonly _comparator?: (left: IN, right: IN) => IN) {
    super();

    if (!this._comparator) {
      this._comparator = (left, right) => {
        this._throwErrorIfNotNumber(left);
        this._throwErrorIfNotNumber(right);
        return left < right ? right : left;
      };
    }
  }

  private _throwErrorIfNotNumber(value: unknown) {
    if (typeof value !== 'number') {
      throw new Error(
        `[max() collector] Numbers expected, erroneous pipeline element received was ${JSON.stringify(value)}`
      );
    }
  }

  override consume(element: IN): void {
    if (!this._max) {
      this._max = element;
    } else {
      this._max = this._comparator(element, this._max);
    }
  }

  override get(): IN {
    return this._max;
  }
}

/**
 * Return a terminal stage that finds the max element in the pipeline. By default, if no comparator
 * function is provided, it assumes every element to be numeric, if at least one element is not numeric,
 * then it will throw an error. If a comparator function is provided, it will use the returned value of
 * the comparator as the max.
 *
 * @param comparator The comparing function that should return the max element between the 2 elements being compared.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function max<IN>(comparator?: (left: IN, right: IN) => IN): TerminalStage<IN, IN> {
  return new MaxCollector<IN>(comparator);
}
