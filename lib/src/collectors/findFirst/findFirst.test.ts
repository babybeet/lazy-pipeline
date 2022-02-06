import { filter } from '../../operators';
import { LazyPipeline } from '../../LazyPipeline';

import { findFirst } from './findFirst';

describe('findFirst()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return the very first element', () => {
    const source = [1, 2, 3, 4, 5, 7, 9];
    const pipeline = LazyPipeline.from(source);
    const result = pipeline.collect(findFirst());

    expect(result).toBe(source[0]);
  });

  test('2. should short-circuit as soon as the first element is found', () => {
    const source = [1, 2, 3, 4, 5, 7, 9, 10, 15];
    const pipeline = LazyPipeline.from(source).add(filter(e => e > 5));
    const collector = findFirst<number>();
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);

    expect(result).toBe(7);
    expect(consumeSpy).toBeCalledTimes(1);
  });

  test('3. should return undefined when pipeline has no elements', () => {
    const source = [1, 2, 3, 4, 5, 7, 9, 10, 15];
    const pipeline = LazyPipeline.from(source).add(filter(e => e > 20));
    const collector = findFirst<number>();
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);

    expect(result).toBeUndefined();
    expect(consumeSpy).not.toBeCalled();
  });
});
