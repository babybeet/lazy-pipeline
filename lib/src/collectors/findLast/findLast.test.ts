import { filter } from '../../operators';
import { LazyPipeline } from '../../LazyPipeline';

import { findLast } from './findLast';

describe('findLast()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return the very last element', () => {
    const source = [1, 2, 7, 4, 5, 3, 9, 15, 10];
    const pipeline = LazyPipeline.from(source).add(filter(e => e > 5));
    const collector = findLast<number>();
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);

    expect(result).toBe(10);
    expect(consumeSpy).toBeCalledTimes(4);
  });

  test('2. should return undefined when pipeline has no elements', () => {
    const source = [1, 2, 3, 4, 5, 7, 9, 10, 15];
    const pipeline = LazyPipeline.from(source).add(filter(e => e > 20));
    const collector = findLast<number>();
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);

    expect(result).toBeUndefined();
    expect(consumeSpy).not.toBeCalled();
  });
});
