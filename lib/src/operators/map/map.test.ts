import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';
import { filter } from '../filter';

import { map } from './map';

describe('map()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should transform all pipeline elements according to the provider mapping function', () => {
    const source = [0, 2, 1, 3, 5, 4, 6, 8];
    const pipeline = LazyPipeline.from(source);
    const operator = map<number, number>(e => e * 2);
    const result = pipeline.add(operator).collect(toArray());
    const expected = source.map(e => e * 2);

    expect(result).toEqual(expected);
  });

  test('2. should not run if pipeline has no elements', () => {
    const source = [0, 2, 1, 5, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const operator = map<number, number>(e => e + 1);
    const consumeSpy = jest.spyOn(operator, 'consume');
    const result = pipeline
      .add(
        filter(() => false),
        operator
      )
      .collect(toArray());

    expect(result).toEqual([]);
    expect(consumeSpy).not.toBeCalled();
  });
});
