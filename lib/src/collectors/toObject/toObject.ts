import { TerminalStage } from '../../stages';

class ToObjectCollector<IN, OUT> extends TerminalStage<IN, Record<string, OUT>> {
  private readonly _object = {} as Record<string, OUT>;

  constructor(
    private readonly _keyExtractor: (element: IN) => string | number,
    private readonly _valueMapper?: (element: IN) => OUT
  ) {
    super();
  }

  override consume(element: IN): void {
    this._object[this._extractKey(element)] = this._valueMapper?.(element) || (element as unknown as OUT);
  }

  private _extractKey(element: IN) {
    const key = this._keyExtractor(element);
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw new Error(
        `[toObject() collector] Extracted key is not string or number, the element received was ${JSON.stringify(
          element
        )}`
      );
    }
    return key;
  }

  override get(): Record<string, OUT> {
    return this._object;
  }
}

/**
 * Return a terminal stage that puts each element into a plain object whose keys are extracted from `keyExtractor` argument.
 *
 * Optionally, each element can be transformed by providing a second argument before being stored in the resulting object.
 *
 * @param keyExtractor The function that instructs this collector how the key is extracted from each element.
 * @param valueMapper The optional argument used to transform the pipeline elements before being stored in the resulting object.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 * @template OUT The optional type parameter of each grouped element to transform to.
 *
 * @returns
 */
export function toObject<IN, OUT>(
  keyExtractor: (element: IN) => string | number,
  valueMapper: (element: IN) => OUT
): TerminalStage<IN, Record<string, OUT>>;

export function toObject<IN>(keyExtractor: (element: IN) => string | number): TerminalStage<IN, Record<string, IN>>;

export function toObject<IN, OUT = IN>(
  keyExtractor: (element: IN) => string | number,
  valueMapper?: (element: IN) => OUT
): TerminalStage<IN, Record<string, OUT>> {
  return new ToObjectCollector<IN, OUT>(keyExtractor, valueMapper);
}
