import { filter } from '../../operators';
import { LazyPipeline } from '../../LazyPipeline';

import { min } from './min';

describe('min()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return the min number using the default comparator', () => {
    const source = [10, 2, 7, 4, 5, 3, 9, 15, 1];
    const pipeline = LazyPipeline.from(source);
    const stage = min<number>();
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);

    expect(result).toBe(1);
    expect(consumeSpy).toHaveBeenCalledTimes(source.length);
  });

  test('2. should return the min element according to the provided comparator', () => {
    const source = [1, 3, 2, 7, 4, 5, 9, 8, 10, 15].map(e => ({ age: e }));
    const pipeline = LazyPipeline.from(source).add(filter(e => e.age > 5));
    const stage = min<{ age: number }>((left, right) => (left.age < right.age ? left : right));
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);
    const expected = source.filter(e => e.age > 5).sort((a, b) => a.age - b.age);

    expect(result).toEqual(expected[0]);
    expect(consumeSpy).toHaveBeenCalledTimes(expected.length);
  });

  test('3. should return undefined when pipeline has no elements', () => {
    const source = [1, 2, 7, 4, 5, 3, 9, 15, 10];
    const pipeline = LazyPipeline.from(source).add(filter(() => false));
    const stage = min<number>();
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);

    expect(result).toBeUndefined();
    expect(consumeSpy).not.toHaveBeenCalled();
  });

  test('4. should throw an error when comparing using the default comparator on non-numeric values', () => {
    const source = ['hello', 1];
    const pipeline = LazyPipeline.from(source);

    expect(() => pipeline.collect(min())).toThrow(
      `[min() collector] Numbers expected, erroneous pipeline element received was ${JSON.stringify(source[0])}`
    );
  });
});
