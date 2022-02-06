import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';

import { limit } from './limit';

describe('limit()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should limit the number of elements in pipeline to the provided value', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = limit(5);
    const result = pipeline.add(stage).collect(toArray());
    const expected = source.slice(0, 5);

    expect(result).toEqual(expected);
  });

  test('2. should cause no elements to exist in pipeline when 0 is provided', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = limit(0);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.add(stage).collect(toArray());

    expect(result).toEqual([]);
    expect(consumeSpy).toHaveBeenCalledTimes(1);
  });

  test('3. should throw an error if the provided limit is less than 0', () => {
    expect(() => limit(-1)).toThrow(
      '[limit() operator] Must be greater than or equal to 0, erroneous pipeline element received was -1'
    );
  });

  test('4. should stop running when the elements seen have passed the provided limit', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = limit(5);
    const consumeSpy = jest.spyOn(stage, 'consume');

    pipeline.add(stage).collect(toArray());

    expect(consumeSpy).toHaveBeenCalledTimes(5);
  });
});
