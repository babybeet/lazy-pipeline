import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';

import { takeWhile } from './takeWhile';

describe('takeWhile()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should keep taking elements as long as the provided predicate is true', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const operator = takeWhile<number>(e => e <= 10);
    const result = pipeline.add(operator).collect(toArray());

    expect(result).toEqual([0, 2, 4, 6, 8, 10]);
  });

  test('2. should no longer run as soon as the provided predicate is false', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const operator = takeWhile<number>(e => e <= 10);
    const consumeSpy = jest.spyOn(operator, 'consume');

    pipeline.add(operator).collect(toArray());

    expect(consumeSpy).toBeCalledTimes(7);
  });
});
