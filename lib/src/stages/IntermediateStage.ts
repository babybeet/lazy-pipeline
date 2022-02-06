import { Stage } from './Stage';

/**
 * Represents an intermediate operation on each element in the pipeline. Intermediate
 * stages perform some action on each element and then forward the resulted element from said
 * action to the next stage in line until the element reaches the terminal stage (commonly called collector).
 *
 * All of the built-in intermediate stages are located inside the `operators` module.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 * @template OUT The type parameter of each outgoing element to be forwarded to the downstream stage.
 */
export abstract class IntermediateStage<IN, OUT> extends Stage<IN> {
  /**
   * The downstream stage to forward elements to.
   */
  protected _downstream: Stage<OUT> | undefined;

  /**
   * Indicate whether this stage should not be run.
   */
  private _detached = false;

  /**
   * Set the downstream stage to forward elements to.
   *
   * @param downstream The downstream stage to forward elements to.
   */
  pipeTo(downstream: Stage<OUT>) {
    this._downstream = downstream;
  }

  get isDetached() {
    return this._detached;
  }

  /**
   * Detach this stage from the pipeline, preventing it from running.
   */
  detach() {
    this._detached = true;
  }

  /**
   * Reset this stage's stages and its downstream state as well.
   */
  override reset(): void {
    super.reset();
    this._downstream.reset();
    this._detached = false;
  }
}
