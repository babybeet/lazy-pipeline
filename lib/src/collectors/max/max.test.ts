import { filter } from '../../operators';
import { LazyPipeline } from '../../LazyPipeline';

import { max } from './max';

describe('max()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return the max number using the default comparator', () => {
    const source = [1, 2, 7, 4, 5, 3, 9, 15, 10];
    const pipeline = LazyPipeline.from(source);
    const collector = max<number>();
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);

    expect(result).toBe(15);
    expect(consumeSpy).toBeCalledTimes(source.length);
  });

  test('2. should return the max element according to the provided comparator', () => {
    const source = [1, 3, 2, 7, 4, 5, 9, 8, 10, 15].map(e => ({ age: e }));
    const pipeline = LazyPipeline.from(source).add(filter(e => e.age > 5));
    const collector = max<{ age: number }>((left, right) => (left.age < right.age ? right : left));
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);
    const expected = source.filter(e => e.age > 5).sort((a, b) => b.age - a.age);

    expect(result).toEqual(expected[0]);
    expect(consumeSpy).toBeCalledTimes(expected.length);
  });

  test('3. should return undefined when pipeline has no elements', () => {
    const source = [1, 2, 7, 4, 5, 3, 9, 15, 10];
    const pipeline = LazyPipeline.from(source).add(filter(() => false));
    const collector = max<number>();
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);

    expect(result).toBeUndefined();
    expect(consumeSpy).not.toBeCalled();
  });

  test('4. should throw an error when comparing using the default comparator on non-numeric values', () => {
    const source = ['hello', 1];
    const pipeline = LazyPipeline.from(source);

    expect(() => pipeline.collect(max())).toThrow(
      `[max() collector] Numbers expected, erroneous pipeline element received was ${JSON.stringify(source[0])}`
    );
  });
});
