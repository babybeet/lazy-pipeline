import { PipelineEvent } from '../PipelineEvent';

import { Stage } from './Stage';

/**
 * Represents an intermediate operation on each element in the pipeline. Intermediate
 * stages perform some action on each element and then forward the resulting element from said
 * action to the next stage in line until the element reaches the terminal stage.
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
   * Resume this stage and its downstream stage as well. If a subclass overrides
   * this method, ensure that it also calls `super.resume()` so that the next stages
   * are resumed as well, otherwise, the stages downstream will not receive any more elements.
   */
  override resume(): void {
    this._downstream.resume();
    this._detached = false;
  }

  /**
   * Detach this stage from the pipeline, preventing it from running.
   */
  protected _detach() {
    this._detached = true;
  }

  /**
   * Forward the given pipeline event to the downstream stage
   *
   * @param event The event to forward to the downstream stage
   */
  protected _cascadeEvent(event: PipelineEvent) {
    if (this._downstream instanceof IntermediateStage) {
      this._downstream._cascadeEvent(event);
    }
  }
}
