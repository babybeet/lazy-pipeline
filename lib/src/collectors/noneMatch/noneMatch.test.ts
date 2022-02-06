import { filter } from '../../operators';
import { LazyPipeline } from '../../LazyPipeline';

import { noneMatch } from './noneMatch';

describe('noneMatch()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return true when no elements match the provided predicate', () => {
    const source = [10, 2, 7, 4, 5, 3, 9, 15, 1];
    const pipeline = LazyPipeline.from(source);
    const stage = noneMatch<number>(e => e > 100);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);

    expect(result).toBe(true);
    expect(consumeSpy).toHaveBeenCalledTimes(source.length);
  });

  test('2. should return false when at least one element matches the provided predicate', () => {
    const source = [1, 3, 2, 7, 4, 5, 9, 8, 10, 15];
    const pipeline = LazyPipeline.from(source).add(filter(e => e > 5));
    const stage = noneMatch<number>(e => e > 9);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);
    const expectedTimesCalled = source.filter(e => e > 5).findIndex(e => e > 9) + 1;

    expect(result).toEqual(false);
    expect(consumeSpy).toHaveBeenCalledTimes(expectedTimesCalled);
  });

  test('3. should short-circuit as soon as one element matches the provided predicate', () => {
    const source = [1, 3, 2, 7, 4, 5, 9, 8, 10, 15];
    const pipeline = LazyPipeline.from(source);
    const stage = noneMatch<number>(e => e > 2);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);

    expect(result).toEqual(false);
    expect(consumeSpy).toHaveBeenCalledTimes(2);
  });

  test('4. should return true when pipeline has no elements', () => {
    const source = [1, 3, 2, 7, 4, 5, 9, 8, 10, 15];
    const pipeline = LazyPipeline.from(source).add(filter(() => false));
    const stage = noneMatch<number>(e => e > 2);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);

    expect(result).toEqual(true);
    expect(consumeSpy).not.toHaveBeenCalled();
  });
});
