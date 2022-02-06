import { Stage } from './Stage';

/**
 * Represents the final operation to collect all of the pipeline elements into a result container.
 * Each terminal stage must implement {@link get()} method to return the final result back
 * to the caller since each pipeline terminates with a call to the terminal stage.
 *
 * All of the built-in collectors are located inside the `collectors` module.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 * @template OUT The type parameter of each outgoing element to be forwarded to the downstream stage.
 */
export abstract class TerminalStage<IN, OUT> extends Stage<IN> {
  /**
   * Return the final result to the caller.
   */
  abstract get(): OUT;
}
