import { TerminalStage } from '../../stages';

class GroupByCollector<IN, KEY, VAL> extends TerminalStage<IN, Map<KEY, VAL[]>> {
  private _groupMap = new Map<KEY, VAL[]>();

  constructor(
    private readonly _keyExtractor: (element: IN) => KEY,
    private readonly _valueMapper?: (element: IN) => VAL
  ) {
    super();
  }

  override consume(element: IN): void {
    const key = this._keyExtractor(element);
    if (!this._groupMap.has(key)) {
      this._groupMap.set(key, []);
    }

    this._groupMap.get(key).push(this._valueMapper?.(element) || (element as unknown as VAL));
  }

  override get(): Map<KEY, VAL[]> {
    return this._groupMap;
  }

  override resume(): void {
    this._groupMap = new Map();
  }
}

/**
 * Return a terminal stage that groups pipeline elements by the keys returned by `keyExtractor` argument.
 * Elements that return the same key will be grouped together in an array used as the value in the mapping.
 *
 * Optionally, each grouped element can be transformed by providing a second argument.
 *
 * @param keyExtractor The function that instructs this collector how the key is extracted from each element.
 * @param valueMapper The optional argument used to transform each grouped element.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 * @template VAL The optional type parameter of each grouped element to transform to.
 *
 * @returns
 */
export function groupBy<IN, KEY, VAL>(
  keyExtractor: (element: IN) => KEY,
  valueMapper: (element: IN) => VAL
): TerminalStage<IN, Map<KEY, VAL[]>>;

export function groupBy<IN, KEY>(keyExtractor: (element: IN) => KEY): TerminalStage<IN, Map<KEY, IN[]>>;

export function groupBy<IN, KEY, VAL = IN>(
  keyExtractor: (element: IN) => KEY,
  valueMapper?: (element: IN) => VAL
): TerminalStage<IN, Map<KEY, VAL[]>> {
  return new GroupByCollector<IN, KEY, VAL>(keyExtractor, valueMapper);
}
