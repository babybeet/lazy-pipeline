import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';

import { skip } from './skip';

describe('skip()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should skip elements in pipeline', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const operator = skip(5);
    const result = pipeline.add(operator).collect(toArray());
    const expected = source.slice(5);

    expect(result).toEqual(expected);
  });

  test('2. should cause no elements to exist in pipeline when skipping by total of elements', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const operator = skip(source.length);
    const result = pipeline.add(operator).collect(toArray());

    expect(result).toEqual([]);
  });

  test('3. should throw an error if the provided skip count is less than 0', () => {
    expect(() => skip(-1)).toThrowError(
      '[skip() operator] Must be greater than or equal to 0, erroneous pipeline element received was -1'
    );
  });

  test('4. should retain all elements when 0 is provided', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const operator = skip(0);
    const result = pipeline.add(operator).collect(toArray());

    expect(result).toEqual(source);
  });

  test('5. should stop executing as soon as the number of skipped elements is reached', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const operator = skip(7);
    const consumeSpy = jest.spyOn(operator, 'consume');

    pipeline.add(operator).collect(toArray());

    expect(consumeSpy).toBeCalledTimes(7);
  });
});
