import { IntermediateStage } from '../../stages';

class MapStage<IN, U> extends IntermediateStage<IN, U> {
  constructor(private readonly _mapper: (element: IN) => U) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    this._downstream.consume(this._mapper(element), hasMoreDataUpstream);
  }
}

/**
 * Return an intermediate stage that transforms each element according the provided mapping function.
 *
 * @param mapper
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 * @template OUT The type parameter of each outgoing element to be forwarded to the downstream stage.
 *
 * @returns
 */
export function map<IN, OUT>(mapper: (element: IN) => OUT): IntermediateStage<IN, OUT> {
  return new MapStage<IN, OUT>(mapper);
}
