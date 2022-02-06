import { PipelineEvent } from '../PipelineEvent';

/**
 * A stage in a pipeline. This abstract class defines the common APIs that each stage must support.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 */
export abstract class Stage<IN> {
  /**
   * The list of subscribers that have registered for events that may be broadcast by this stage.
   */
  private _eventSubscribers: Array<(event: PipelineEvent, stage: Stage<IN>) => void> = [];

  /**
   * Reset this stage.
   */
  reset() {
    this._eventSubscribers = [];
  }

  /**
   * Notify all listeners of `event`.
   *
   * @param event The event with which to notify the listeners.
   */
  broadcast(event: PipelineEvent) {
    for (const subscriber of this._eventSubscribers) {
      subscriber(event, this);
    }
  }

  /**
   * Subscribe to the provided event.
   *
   * @param subscriber
   */
  subscribe(subscriber: (event: PipelineEvent, stage: Stage<IN>) => void) {
    this._eventSubscribers.push(subscriber);
  }

  /**
   * Consume a new element in the pipeline, this stage must call the downstream stage
   * to let the elements flow thru the pipeline from source to the collector.
   *
   * @param element The element that this stage receives.
   * @param hasMoreDataUpstream A flag to indicate whether there are more elements coming in.
   */
  abstract consume(element: IN, hasMoreDataUpstream: boolean): void;
}
