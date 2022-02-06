import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';

import { filter } from './filter';

describe('filter()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should filter out elements that do not match provided predicate', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = filter<number>(e => e <= 10);
    const result = pipeline.add(stage).collect(toArray());
    const expected = source.filter(e => e <= 10);

    expect(result).toEqual(expected);
  });

  test('2. should not run if pipeline has no elements', () => {
    const source = [] as unknown[];
    const pipeline = LazyPipeline.from(source);
    const stage = filter<number>(e => e <= 10);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.add(stage).collect(toArray());

    expect(result).toEqual([]);
    expect(consumeSpy).not.toHaveBeenCalled();
  });

  test('3. should let elements matching provided predicate thru', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const stage = filter<number>(e => e >= 0);
    const result = pipeline.add(stage).collect(toArray());

    expect(result).toEqual(source);
  });
});
