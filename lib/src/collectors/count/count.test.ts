import { LazyPipeline } from '../../LazyPipeline';

import { count } from './count';

describe('count()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return the number of elements in pipeline', () => {
    const source = [1, 2, 3, 4, 5, 7, 9];
    const pipeline = LazyPipeline.from(source);
    const result = pipeline.collect(count());

    expect(result).toBe(source.length);
  });

  test('2 should return 0 when pipeline has no elements', () => {
    const source = [] as unknown[];
    const pipeline = LazyPipeline.from(source);
    const result = pipeline.collect(count());

    expect(result).toBe(0);
  });
});
