/**
 * An enum of events that the pipeline stages may emit.
 */
export const enum PipelineEvent {
  /**
   * An event broadcast by a stage to indicate that the pipeline should terminate early and return the result.
   */
  TERMINATE_EARLY = 'TERMINATE_EARLY',

  /**
   * Stages wish to detach themselves from the pipeline can raise this event, detached stages are not executed
   * when the pipeline is evaluated when a terminal stage is triggered.
   */
  DETACH_STAGE = 'DETACH_STAGE'
}
