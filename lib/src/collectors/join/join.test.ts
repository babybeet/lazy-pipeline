import { LazyPipeline } from '../../LazyPipeline';

import { join } from './join';

describe('join()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should join elements by the provided delimiter', () => {
    const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pipeline = LazyPipeline.from(source);
    const stage = join<number>(':');
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);
    const expected = source.join(':');

    expect(result).toBe(expected);
    expect(consumeSpy).toHaveBeenCalledTimes(source.length);
  });

  test('2. should not run the provided action when pipeline has no elements', () => {
    const source = [] as [];
    const pipeline = LazyPipeline.from(source);
    const stage = join<number>(',');
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);
    const expected = source.join(',');

    expect(result).toBe(expected);
    expect(consumeSpy).not.toHaveBeenCalled();
  });
});
