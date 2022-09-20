/**
 * An enum of events that the pipeline stages may emit.
 */
export const enum PipelineEvent {
  /**
   * An event broadcast by a stage to indicate that the pipeline should terminate and return the result.
   */
  TERMINATE_PIPELINE = 'TERMINATE_PIPELINE',

  /**
   * Stages that detach themselves from the pipeline should raise this event, detached stages
   * are not executed when the pipeline is evaluated when a terminal stage is triggered.
   */
  STAGE_DETACHED = 'STAGE_DETACHED'
}
