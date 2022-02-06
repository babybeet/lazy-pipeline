import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';
import { filter } from '../filter';
import { limit } from '../limit';

import { peek } from './peek';

describe('peek()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should be called with each element in pipeline', () => {
    const source = [0, 2, 1, 3, 5, 4, 6, 8];
    const pipeline = LazyPipeline.from(source);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const stage = peek<number>(() => {});
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.add(limit(2), stage).collect(toArray());
    const expected = source.slice(0, 2);

    expect(result).toEqual(expected);
    expect(consumeSpy).toHaveBeenCalledTimes(2);
  });

  test('2. should not run if pipeline has no elements', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const stage = peek<number>(() => {});
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline
      .add(
        filter(() => false),
        stage
      )
      .collect(toArray());

    expect(result).toEqual([]);
    expect(consumeSpy).not.toHaveBeenCalled();
  });
});
