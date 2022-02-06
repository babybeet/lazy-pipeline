import { TerminalStage } from '../../stages';

class CountCollector extends TerminalStage<unknown, number> {
  private _count = 0;

  override consume(): void {
    this._count++;
  }

  override get(): number {
    return this._count;
  }

  override resume(): void {
    this._count = 0;
  }
}

/**
 * Return a terminal stage that calculates the total number of elements in the pipeline.
 */
export function count(): TerminalStage<unknown, number> {
  return new CountCollector();
}
