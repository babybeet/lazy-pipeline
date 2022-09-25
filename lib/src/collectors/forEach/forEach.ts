import { TerminalStage } from '../../stages';

class ForEachCollector<IN> extends TerminalStage<IN, undefined> {
  constructor(private readonly _action: (element: IN) => void) {
    super();
  }

  override consume(element: IN): void {
    this._action(element);
  }

  override get(): undefined {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  override resume(): void {}
}

/**
 * Return a terminal stage that executes the given `action` on each pipeline element.
 *
 * @param action The action to execute on each pipeline element
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 *
 * @returns
 */
export function forEach<IN>(action: (element: IN) => void): TerminalStage<IN, undefined> {
  return new ForEachCollector<IN>(action);
}
