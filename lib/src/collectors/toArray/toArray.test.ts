import { filter } from '../../operators';
import { LazyPipeline } from '../../LazyPipeline';

import { toArray } from './toArray';

describe('toArray()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return an array of elements in pipeline', () => {
    const source = [10, 2, 7, 4, 5, 3, 9, 15, 1];
    const pipeline = LazyPipeline.from(source);
    const collector = toArray<number>();
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);

    expect(result).toEqual(source);
    expect(consumeSpy).toBeCalledTimes(source.length);
  });

  test('2. should return an empty array when pipeline has no elements', () => {
    const source = [1, 3, 2, 7, 4, 5, 9, 8, 10, 15];
    const pipeline = LazyPipeline.from(source).add(filter(() => false));
    const collector = toArray();
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);

    expect(result).toEqual([]);
    expect(consumeSpy).not.toBeCalled();
  });
});
