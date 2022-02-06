import { TerminalStage } from '../../stages';

class MinCollector<IN> extends TerminalStage<IN, IN> {
  private _minimum: IN;

  constructor(private readonly _comparator?: (left: IN, right: IN) => IN) {
    super();

    if (!this._comparator) {
      this._comparator = (left, right) => {
        this._throwErrorIfNotNumber(left);
        this._throwErrorIfNotNumber(right);
        return left < right ? left : right;
      };
    }
  }

  private _throwErrorIfNotNumber(value: unknown) {
    if (typeof value !== 'number') {
      throw new Error(
        `[min() collector] Numbers expected, erroneous pipeline element received was ${JSON.stringify(value)}`
      );
    }
  }

  override consume(element: IN): void {
    if (!this._minimum) {
      this._minimum = element;
    } else {
      this._minimum = this._comparator(element, this._minimum);
    }
  }

  override get(): IN {
    return this._minimum;
  }
}

/**
 * Return a terminal stage that finds the mim element in the pipeline. By default, if no comparator
 * function is provided, it assumes every element to be numeric, if at least one element is not numeric,
 * then it will throw an error. If a comparator function is provided, it will use the returned value of
 * the comparator as the min.
 *
 * @param comparator The comparing function that should return the min element between the 2 elements being compared.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function min<IN>(comparator?: (left: IN, right: IN) => IN): TerminalStage<IN, IN> {
  return new MinCollector<IN>(comparator);
}
