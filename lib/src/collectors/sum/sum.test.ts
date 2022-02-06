import { filter } from '../../operators';
import { LazyPipeline } from '../../LazyPipeline';

import { sum } from './sum';

describe('sum()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return the correct sum', () => {
    const source = [10, 2, 7, 4, 5, 3, 9, 15, 1];
    const pipeline = LazyPipeline.from(source);
    const stage = sum<number>();
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);
    const expected = source.reduce((a, b) => a + b);

    expect(result).toBe(expected);
    expect(consumeSpy).toHaveBeenCalledTimes(source.length);
  });

  test('2. should return 0 when pipeline has no elements', () => {
    const source = [1, 3, 2, 7, 4, 5, 9, 8, 10, 15];
    const pipeline = LazyPipeline.from(source).add(filter(() => false));
    const stage = sum();
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);

    expect(result).toEqual(0);
    expect(consumeSpy).not.toHaveBeenCalled();
  });

  test('3. should throw an error when not all elements are numbers', () => {
    const source = ['hello', 1];
    const pipeline = LazyPipeline.from(source);

    expect(() => pipeline.collect(sum())).toThrow(
      `[sum() collector] Numbers expected, erroneous pipeline element received was ${JSON.stringify(source[0])}`
    );
  });
});
