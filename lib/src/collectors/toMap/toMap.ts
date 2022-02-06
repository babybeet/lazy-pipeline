import { TerminalStage } from '../../stages';

class ToMapCollector<IN, OUT> extends TerminalStage<IN, Map<any, OUT>> {
  private readonly _map = new Map<any, OUT>();

  constructor(
    private readonly _keyExtractor: (element: IN) => any,
    private readonly _valueMapper?: (element: IN) => OUT
  ) {
    super();
  }

  override consume(element: IN): void {
    this._map.set(this._keyExtractor(element), this._valueMapper?.(element) || (element as unknown as OUT));
  }

  override get(): Map<any, OUT> {
    return this._map;
  }
}

/**
 * Return a terminal stage that puts each element into a map whose keys are extracted from `keyExtractor` argument.
 *
 * Optionally, each element can be transformed by providing a second argument before being stored in the resulting map.
 *
 * @param keyExtractor The function that instructs this collector how the key is extracted from each element.
 * @param valueMapper The optional argument used to transform the pipeline elements before being stored in the resulting map.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 * @template OUT The optional type parameter of each grouped element to transform to
 *
 * @returns
 */
export function toMap<IN, OUT>(
  keyExtractor: (element: IN) => any,
  valueMapper: (element: IN) => OUT
): TerminalStage<IN, Map<any, OUT>>;

export function toMap<IN>(keyExtractor: (element: IN) => any): TerminalStage<IN, Map<any, IN>>;

export function toMap<IN, OUT = IN>(
  keyExtractor: (element: IN) => any,
  valueMapper?: (element: IN) => OUT
): TerminalStage<IN, Map<any, OUT>> {
  return new ToMapCollector<IN, OUT>(keyExtractor, valueMapper);
}
