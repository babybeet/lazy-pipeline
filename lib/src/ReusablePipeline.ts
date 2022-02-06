import { IntermediateStage, TerminalStage } from './stages';

/**
 * The APIs of each reusable pipeline.
 *
 * @template IN The type parameter of each element in the pipeline.
 */
export interface ReusablePipeline<IN> {
  /**
   * Add additional intermediate stages to this pipeline, if this pipeline has been frozen which happens after
   * the terminal stage is triggered, then calling this method will throw an error to indicate as such.
   *
   * @param stages The stages to add.
   *
   * @return This pipeline instance.
   */
  add(...stages: IntermediateStage<any, any>[]): ReusablePipeline<IN>;

  /**
   * Collect all elements remaining in the pipeline into a result container according to the provided terminal stage.
   *
   * @param collector The terminal stage that dictates how the remaining elements in the pipeline are collected.
   *
   * @return The result container as specified by the provided terminal stage
   */
  collect<OUT>(collector: TerminalStage<IN, OUT>): OUT;

  /**
   * A convenient method that collects all elements into an array and returns that array.
   */
  toArray(): IN[];

  /**
   * Reset this pipeline so that it can be used again.
   */
  reset(): void;

  /**
   * Configure this pipeline to read from the given source.
   *
   * @param newSource The new source to read elements from.
   */
  readFrom(newSource: Iterable<IN>): void;

  /**
   * Prevent new intermediate stages from being added to this pipeline.
   */
  freeze(): void;

  /**
   * Make this pipeline accept new intermediate stages again.
   */
  unfreeze(): void;
}
