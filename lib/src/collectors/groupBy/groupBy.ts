import { TerminalStage } from '../../stages';

class GroupByCollector<IN, OUT> extends TerminalStage<IN, Map<any, OUT[]>> {
  private readonly _groupMap = new Map<any, OUT[]>();

  constructor(
    private readonly _keyExtractor: (element: IN) => any,
    private readonly _valueMapper?: (element: IN) => OUT
  ) {
    super();
  }

  override consume(element: IN): void {
    const key = this._keyExtractor(element);
    if (!this._groupMap.has(key)) {
      this._groupMap.set(key, []);
    }

    this._groupMap.get(key).push(this._valueMapper?.(element) || (element as unknown as OUT));
  }

  override get(): Map<any, OUT[]> {
    return this._groupMap;
  }
}

/**
 * Return a terminal stage that groups pipeline elements by the keys returned from `keyExtractor`. The
 * return `Map` will contain mappings from the keys returned by `extractor` to an array of elements
 * that belong the same key as dictated by `keyExtractor`.
 *
 * Optionally, each grouped element can be transformed by providing a second argument.
 *
 * @param keyExtractor The function that instructs this collector how the key is extracted from each element.
 * @param valueMapper The optional argument used to transform each grouped element.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 * @template OUT The optional type parameter of each grouped element to transform to.
 *
 * @returns
 */
export function groupBy<IN, OUT>(
  keyExtractor: (element: IN) => any,
  valueMapper: (element: IN) => OUT
): TerminalStage<IN, Map<any, OUT[]>>;

export function groupBy<IN>(keyExtractor: (element: IN) => any): TerminalStage<IN, Map<any, IN[]>>;

export function groupBy<IN, OUT = IN>(
  keyExtractor: (element: IN) => any,
  valueMapper?: (element: IN) => OUT
): TerminalStage<IN, Map<any, OUT[]>> {
  return new GroupByCollector<IN, OUT>(keyExtractor, valueMapper);
}
