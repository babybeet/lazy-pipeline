import { TerminalStage } from '../../stages';

class ReduceCollector<IN, OUT = IN> extends TerminalStage<IN, OUT> {
  private _accumulator: OUT = undefined;
  private _hasSeenAtLeastOneElement = false;

  constructor(private readonly _reducer: (accumulator: OUT, next: IN) => OUT, private readonly _initialValue?: OUT) {
    super();

    this._accumulator = _initialValue;
  }

  override consume(element: IN): void {
    /*
     * If we've seen at least one element, or if an initial value was provided
     */
    if (this._hasSeenAtLeastOneElement || this._accumulator !== undefined) {
      this._accumulator = this._reducer(this._accumulator, element);
    } else {
      this._accumulator = element as unknown as OUT;
      this._hasSeenAtLeastOneElement = true;
    }
  }

  override get(): OUT {
    if (!this._hasSeenAtLeastOneElement && this._accumulator === undefined) {
      throw new Error('[reduce() collector] Pipeline has no elements, and no initial value was provided');
    }
    return this._accumulator;
  }

  override resume(): void {
    this._accumulator = this._initialValue;
    this._hasSeenAtLeastOneElement = true;
  }
}

/**
 * Return a terminal stage that performs a reduction of the received pipeline elements using the
 * provided* `reducer` function, optionally accepting an initial value as the second argument.
 *
 * The `reducer` function accepts 2 arguments, the first argument is the accumulator value that will
 * be returned when the reduction is complete, the second argument is the next pipeline element to
 * reduce into the accumulator.
 *
 * This collector's behavior is similar to that of
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#description Array.prototype.reduce}.
 *
 * @param reducer The function used to reduce the incoming pipeline elements.
 * @param initialValue The optional initial value used for the reduction.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function reduce<IN, OUT>(
  reducer: (accumulator: OUT, next: IN) => OUT,
  initialValue?: OUT
): TerminalStage<IN, OUT>;

export function reduce<IN>(reducer: (accumulator: IN, next: IN) => IN): TerminalStage<IN, IN>;

export function reduce<IN, OUT = IN>(
  reducer: (accumulator: OUT, next: IN) => OUT,
  initialValue?: OUT
): TerminalStage<IN, OUT> {
  return new ReduceCollector<IN, OUT>(reducer, initialValue);
}
