import { TerminalStage } from '../../stages';

class JoinCollector<IN> extends TerminalStage<IN, string> {
  private _joinedString = '';

  constructor(private readonly _delimiter: string) {
    super();
  }

  override consume(element: IN): void {
    this._joinedString += `${this._delimiter}${element}`;
  }

  override get(): string {
    // Trim the delimiter at the start of the joined string
    return this._joinedString.replace(this._delimiter, '');
  }

  override resume(): void {
    this._joinedString = '';
  }
}

/**
 * Return a terminal stage that concatenates the input elements, separated by the specified delimiter, in encounter order.
 *
 * @param delimiter The delimiter to be used between each element.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function join<IN>(delimiter: string): TerminalStage<IN, string> {
  return new JoinCollector<IN>(delimiter);
}
