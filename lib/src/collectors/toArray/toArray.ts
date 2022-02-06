import { TerminalStage } from '../../stages';

class ArrayCollector<IN> extends TerminalStage<IN, IN[]> {
  private readonly _elements: IN[] = [];

  override consume(element: IN): void {
    this._elements.push(element);
  }

  override get(): IN[] {
    return this._elements;
  }
}

/**
 * Return a terminal stage that collects all elements in the pipeline into an array.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function toArray<IN>(): TerminalStage<IN, IN[]> {
  return new ArrayCollector<IN>();
}
