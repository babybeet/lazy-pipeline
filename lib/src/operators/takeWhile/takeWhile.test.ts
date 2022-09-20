import { sorted } from '../sorted';
import { limit } from '../limit';
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
    const stage = takeWhile<number>(e => e <= 10);
    const result = pipeline.add(stage).collect(toArray());

    expect(result).toEqual([0, 2, 4, 6, 8, 10]);
  });

  test('2. should no longer run as soon as the provided predicate is false', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = takeWhile<number>(e => e <= 10);
    const consumeSpy = jest.spyOn(stage, 'consume');

    pipeline.add(stage).collect(toArray());

    expect(consumeSpy).toHaveBeenCalledTimes(7);
  });

  test('3. should not run when pipeline has no elements', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = takeWhile<number>(e => e <= 10);
    const consumeSpy = jest.spyOn(stage, 'consume');

    const result = pipeline.add(limit(0), stage).collect(toArray());

    expect(result).toHaveLength(0);
    expect(consumeSpy).not.toHaveBeenCalled();
  });

  test('4. should cause downstream stage to terminate when terminating', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = takeWhile<number>(e => e <= 10);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const expected = source.slice(0, 6).sort((left, right) => right - left);
    const result = pipeline
      .add(
        stage,
        sorted((left, right) => right - left)
      )
      .collect(toArray());

    expect(result).toEqual(expected);
    expect(consumeSpy).toHaveBeenCalledTimes(7);
  });
});
