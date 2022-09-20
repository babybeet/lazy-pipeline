import { toArray } from './collectors/toArray';
import { ReusablePipeline } from './ReusablePipeline';
import { PipelineEvent } from './PipelineEvent';
import { IntermediateStage, Stage, TerminalStage } from './stages';

/**
 * A reusable pipeline that lazily evaluates the data processing operations which are referred to as stages.
 * These stages are only evaluated when a terminal stage is triggered by calling
 * {@link collect()}, passing in an implementation of a terminal operation or by calling or {@link toArray()}.
 *
 * Each lazy pipeline is a stage itself that acts as the source which in turn pipes
 * each element in the underlying data source to its downstream stages.
 *
 * A notable feature of this pipeline is that it is reusable, so you can construct your pipeline however
 * you'd like and reuse it in different places with no worries about data corruptions by calling {@link resume()}
 * before triggering a terminal stage on the pipeline, otherwise, an error will occur.
 *
 * @template IN The type parameter of each element in the pipeline.
 */
export class LazyPipeline<IN> extends IntermediateStage<IN, any> implements ReusablePipeline<IN> {
  /**
   * The intermediate stages that were added to this pipeline so far
   */
  private readonly _stages: IntermediateStage<IN, any>[] = [this];

  /**
   * The data source to operate upon
   */
  private _source: IN[];

  private _isTerminated = false;
  private _isFrozen = false;

  private _terminalStage: TerminalStage<IN, any>;

  constructor(source: Iterable<IN>) {
    super();

    this._source = Array.from(source);

    this._watchForPipelineEvent = this._watchForPipelineEvent.bind(this);
  }

  static from<IN>(iterable: Iterable<IN>) {
    return new LazyPipeline(iterable);
  }

  add<A>(stage: IntermediateStage<IN, A>): ReusablePipeline<A>;

  add<A, B>(stage1: IntermediateStage<IN, A>, stage2: IntermediateStage<A, B>): ReusablePipeline<B>;

  add<A, B, C>(
    stage1: IntermediateStage<IN, A>,
    stage2: IntermediateStage<A, B>,
    stage3: IntermediateStage<B, C>
  ): ReusablePipeline<C>;

  add<A, B, C, D>(
    stage1: IntermediateStage<IN, A>,
    stage2: IntermediateStage<A, B>,
    stage3: IntermediateStage<B, C>,
    stage4: IntermediateStage<C, D>
  ): ReusablePipeline<D>;

  add<A, B, C, D, E>(
    stage1: IntermediateStage<IN, A>,
    stage2: IntermediateStage<A, B>,
    stage3: IntermediateStage<B, C>,
    stage4: IntermediateStage<C, D>,
    stage5: IntermediateStage<D, E>
  ): ReusablePipeline<E>;

  add<A, B, C, D, E, F>(
    stage1: IntermediateStage<IN, A>,
    stage2: IntermediateStage<A, B>,
    stage3: IntermediateStage<B, C>,
    stage4: IntermediateStage<C, D>,
    stage5: IntermediateStage<D, E>,
    stage6: IntermediateStage<E, F>
  ): ReusablePipeline<F>;

  add<A, B, C, D, E, F, G>(
    stage1: IntermediateStage<IN, A>,
    stage2: IntermediateStage<A, B>,
    stage3: IntermediateStage<B, C>,
    stage4: IntermediateStage<C, D>,
    stage5: IntermediateStage<D, E>,
    stage6: IntermediateStage<E, F>,
    stage7: IntermediateStage<F, G>
  ): ReusablePipeline<G>;

  add<A, B, C, D, E, F, G, H>(
    stage1: IntermediateStage<IN, A>,
    stage2: IntermediateStage<A, B>,
    stage3: IntermediateStage<B, C>,
    stage4: IntermediateStage<C, D>,
    stage5: IntermediateStage<D, E>,
    stage6: IntermediateStage<E, F>,
    stage7: IntermediateStage<F, G>,
    stage8: IntermediateStage<G, H>
  ): ReusablePipeline<H>;

  add<A, B, C, D, E, F, G, H, I>(
    stage1: IntermediateStage<IN, A>,
    stage2: IntermediateStage<A, B>,
    stage3: IntermediateStage<B, C>,
    stage4: IntermediateStage<C, D>,
    stage5: IntermediateStage<D, E>,
    stage6: IntermediateStage<E, F>,
    stage7: IntermediateStage<F, G>,
    stage8: IntermediateStage<G, H>,
    stage9: IntermediateStage<H, I>
  ): ReusablePipeline<I>;

  add<A, B, C, D, E, F, G, H, I, J>(
    stage1: IntermediateStage<IN, A>,
    stage2: IntermediateStage<A, B>,
    stage3: IntermediateStage<B, C>,
    stage4: IntermediateStage<C, D>,
    stage5: IntermediateStage<D, E>,
    stage6: IntermediateStage<E, F>,
    stage7: IntermediateStage<F, G>,
    stage8: IntermediateStage<G, H>,
    stage9: IntermediateStage<H, I>,
    stage10: IntermediateStage<I, J>,
    ...stages: IntermediateStage<J, any>[]
  ): ReusablePipeline<any>;

  add(...stages: IntermediateStage<IN, any>[]) {
    if (this._isFrozen) {
      throw new Error(
        '[LazyPipeline class] Pipeline has been frozen, call unfreeze() before adding new intermediate stages'
      );
    }
    this._attachNewStages(stages);

    if (this._stages.length === 1) {
      this.pipeTo(stages[0]);
    }
    this._stages.push(...stages);

    return this;
  }

  private _attachNewStages(stages: IntermediateStage<IN, any>[]) {
    const totalNewStages = stages.length;
    for (let index = 0; index < totalNewStages; index++) {
      const currentStage = stages[index];
      const downstreamStage = stages[index + 1];

      if (downstreamStage) {
        currentStage.pipeTo(downstreamStage);
      }
      currentStage.subscribe(this._watchForPipelineEvent);
    }
  }

  private _watchForPipelineEvent(event: PipelineEvent, stage: Stage<IN>) {
    switch (event) {
      case PipelineEvent.TERMINATE_PIPELINE:
        this._isTerminated = true;
        break;
      case PipelineEvent.STAGE_DETACHED:
        if (stage instanceof IntermediateStage) {
          const indexOfDetachedStage = this._stages.indexOf(stage);
          const stageBefore = this._stages[indexOfDetachedStage - 1];
          const stageAfter = this._stages[indexOfDetachedStage + 1];

          stageBefore?.pipeTo(stageAfter || this._terminalStage);
        } else {
          throw new Error(
            `[LazyPipeline class] Only intermediate stages can be detached, detached stage was ${JSON.stringify(stage)}`
          );
        }
    }
  }

  collect<OUT>(terminalStage: TerminalStage<IN, OUT>) {
    if (this._isTerminated) {
      throw new Error(
        '[LazyPipeline class] Pipeline has been terminated, call resume() before attempting to use it again'
      );
    }

    const lastStage = this._stages[this._stages.length - 1];
    lastStage.pipeTo(terminalStage);

    this._terminalStage = terminalStage;

    terminalStage.subscribe(this._watchForPipelineEvent);

    const totalElementCount = this._source.length;
    for (let index = 0; index < totalElementCount && !this._isTerminated; index++) {
      this.consume(this._source[index], index !== totalElementCount - 1);
    }

    this._isFrozen = true;
    this._isTerminated = true;

    return terminalStage.get();
  }

  toArray(): IN[] {
    return this.collect(toArray<IN>());
  }

  resume(): void {
    this._isTerminated = false;
    this._terminalStage.removeAllEventListeners();
    this._reconnectAllStages();
    this._downstream.resume();
  }

  private _reconnectAllStages() {
    const totalStages = this._stages.length;
    for (let index = 0; index < totalStages - 1; index++) {
      const currentStage = this._stages[index];
      const downstreamStage = this._stages[index + 1];

      currentStage.pipeTo(downstreamStage);
    }

    const lastStage = this._stages[this._stages.length - 1];
    lastStage.pipeTo(this._terminalStage);
  }

  readFrom(newSource: Iterable<IN>): void {
    this._source = Array.from(newSource);
  }

  freeze(): void {
    this._isFrozen = true;
  }

  unfreeze(): void {
    this._isFrozen = false;
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    this._downstream.consume(element, hasMoreDataUpstream);
  }
}
