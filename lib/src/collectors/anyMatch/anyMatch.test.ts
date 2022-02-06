import { LazyPipeline } from '../../LazyPipeline';

import { anyMatch } from './anyMatch';

describe('anyMatch()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return true', () => {
    const source = [1, 2, 3, 4, 5, 7, 9];
    const pipeline = LazyPipeline.from(source);
    const result = pipeline.collect(anyMatch(e => e % 2 === 0));

    expect(result).toBe(true);
  });

  test('2 should short-circuit as soon as true is returned', () => {
    const source = [1, 2, 3, 4, 5, 7, 9];
    const pipeline = LazyPipeline.from(source);
    const stage = anyMatch<number>(e => e % 2 === 0);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);

    expect(result).toBe(true);
    expect(consumeSpy).toHaveBeenCalledTimes(2);
  });

  test('3. should return false', () => {
    const source = [1, 3, 5, 7, 9];
    const pipeline = LazyPipeline.from(source);
    const stage = anyMatch<number>(e => e > 10);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);

    expect(result).toBe(false);
    expect(consumeSpy).toHaveBeenCalledTimes(source.length);
  });
});
