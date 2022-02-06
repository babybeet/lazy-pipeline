import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';

import { dropWhile } from './dropWhile';

describe('dropWhile()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should drop elements as long as the provided predicate is true', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = dropWhile<number>(e => e <= 10);
    const result = pipeline.add(stage).collect(toArray());

    expect(result).toEqual([11, 10, 8, 6, 12, 13, 17]);
  });

  test('2. should no longer run as soon as the provided predicate is false', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = dropWhile<number>(e => e <= 10);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.add(stage).collect(toArray());

    expect(result).toEqual([11, 10, 8, 6, 12, 13, 17]);
    expect(consumeSpy).toHaveBeenCalledTimes(7);
  });

  test('3. should execute again when pipeline is resumed', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = dropWhile<number>(e => e <= 10);
    const result = pipeline.add(stage).collect(toArray());

    expect(result).toEqual([11, 10, 8, 6, 12, 13, 17]);

    pipeline.resume();

    const consumeSpy = jest.spyOn(stage, 'consume');

    expect(pipeline.toArray()).toEqual([11, 10, 8, 6, 12, 13, 17]);
    expect(consumeSpy).toHaveBeenCalledTimes(7);
  });
});
