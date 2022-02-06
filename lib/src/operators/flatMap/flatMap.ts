/* eslint-disable jsdoc/check-indentation */

import { IntermediateStage } from '../../stages';

class FlatMapStage<IN, OUT> extends IntermediateStage<IN, OUT> {
  constructor(private readonly _flatMapper: (element: IN) => OUT[]) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    const flattenedList = this._flatMapper(element);
    if (Array.isArray(flattenedList)) {
      const totalElement = flattenedList.length;
      for (let index = 0; index < totalElement; index++) {
        this._downstream.consume(flattenedList[index], hasMoreDataUpstream || index !== totalElement - 1);
      }
    } else {
      throw new Error(
        `[flatMap() operator] Element to flatMap did not generate an array, it was ${JSON.stringify(element)}`
      );
    }
  }
}

/**
 * Return an intermediate stage that flattens the inner array returned by the `flatMapper` argument into the pipeline.
 *
 * @param flatMapper A mapper function that returns an array from the upstream pipeline element, the returned array
 *                   is flattened into the pipeline so that each returned array's element will flow through the
 *                   pipeline one by one.
 *
 * @template IN The type parameter of each incoming element in the pipeline.
 * @template OUT The type parameter of each outgoing element to be forwarded to the downstream stage.
 *
 * @returns
 */
export function flatMap<IN, OUT>(flatMapper: (element: IN) => OUT[]): IntermediateStage<IN, OUT> {
  return new FlatMapStage<IN, OUT>(flatMapper);
}
