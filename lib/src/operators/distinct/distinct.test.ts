import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';
import { filter } from '../filter';

import { distinct } from './distinct';

describe('distinct()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should only let distinct elements thru', () => {
    const source = [20, 2, 4, 6, 8, 10, 10, 8, 6, 12];
    const pipeline = LazyPipeline.from(source);
    const operator = distinct<number>();
    const result = pipeline.add(operator).collect(toArray());

    expect(result).toEqual([20, 2, 4, 6, 8, 10, 12]);
  });

  test('2. should return an empty array when pipeline has no elements', () => {
    const source = [20, 2, 4, 6, 8, 10, 10, 8, 6, 12];
    const pipeline = LazyPipeline.from(source);
    const operator = distinct<number>();
    const result = pipeline
      .add(
        filter(() => false),
        operator
      )
      .collect(toArray());

    expect(result).toHaveLength(0);
  });
});
