import { LazyPipeline } from '../../LazyPipeline';

import { allMatch } from './allMatch';

describe('allMatch()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return true', () => {
    const source = [2, 4, 6, 8, 10];
    const pipeline = LazyPipeline.from(source);
    const result = pipeline.collect(allMatch(e => e % 2 === 0));

    expect(result).toBe(true);
  });

  test('2. should return false', () => {
    const source = [1, 3, 5, 7, 9];
    const pipeline = LazyPipeline.from(source);
    const result = pipeline.collect(allMatch(e => e % 2 === 0));

    expect(result).toBe(false);
  });

  test('3. should short-circuit as soon as one element does not match provided predicate', () => {
    const source = [0, 2, 4, 1, 3, 5, 7, 9];
    const pipeline = LazyPipeline.from(source);
    const collector = allMatch<number>(e => e % 2 === 0);
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);

    expect(result).toBe(false);
    expect(consumeSpy).toBeCalledTimes(4);
  });
});
