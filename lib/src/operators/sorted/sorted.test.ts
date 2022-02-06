import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';
import { filter } from '../filter';

import { sorted } from './sorted';

describe('sorted()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should sort the same way as Array.prototype.sort() does when no comparator is provided', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const operator = sorted<number>();
    const result = pipeline.add(operator).collect(toArray());
    const expected = source.sort();

    expect(result).toEqual(expected);
  });

  test('2. should sort by the provided comparator', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const comparator = (left: number, right: number) => right - left;
    const pipeline = LazyPipeline.from(source);
    const operator = sorted(comparator);
    const result = pipeline.add(operator).collect(toArray());
    const expected = source.sort(comparator);

    expect(result).toEqual(expected);
  });

  test('3. should not run if pipeline has no elements', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const operator = sorted();
    const consumeSpy = jest.spyOn(operator, 'consume');
    const result = pipeline
      .add(
        filter(() => false),
        operator
      )
      .collect(toArray());

    expect(result).toHaveLength(0);
    expect(consumeSpy).not.toBeCalled();
  });
});
