import { LazyPipeline } from '../../LazyPipeline';

import { average } from './average';

describe('average()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return the correct average', () => {
    const source = [1, 2, 3, 4, 5, 7, 9];
    const pipeline = LazyPipeline.from(source);
    const result = pipeline.collect(average());
    const expectedAverage = source.reduce((a, b) => a + b) / source.length;

    expect(result.toFixed(2)).toBe(expectedAverage.toFixed(2));
  });

  test('2. should throw an error when pipeline has no elements', () => {
    const pipeline = LazyPipeline.from([]);
    const averageCollector = average();
    const consumeSpy = jest.spyOn(averageCollector, 'consume');

    expect(consumeSpy).not.toHaveBeenCalled();
    expect(() => pipeline.collect(averageCollector)).toThrow('[average() collector] Pipeline contains 0 elements');
  });
});
