import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';

import { flatMap } from './flatMap';

describe('flatMap()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should flatten inner arrays', () => {
    const source = [
      [0, 2, 4],
      [6, 8, 10],
      [11, 10, 8, 6],
      [12, 13, 17]
    ];
    const pipeline = LazyPipeline.from(source);
    const operator = flatMap<number[], number>(e => e);
    const result = pipeline.add(operator).collect(toArray());
    const expected = source.flatMap(e => e);

    expect(result).toEqual(expected);
  });

  test('2. should not run if pipeline has no elements', () => {
    const source = [] as unknown[];
    const pipeline = LazyPipeline.from(source);
    const operator = flatMap<number[], number>(e => e);
    const consumeSpy = jest.spyOn(operator, 'consume');
    const result = pipeline.add(operator).collect(toArray());

    expect(result).toEqual([]);
    expect(consumeSpy).not.toBeCalled();
  });

  test('3. should throw an error if the element to flatMap does not generate an array', () => {
    const source = [0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17];
    const pipeline = LazyPipeline.from(source);
    const operator = flatMap<any, number>(e => e);

    expect(() => pipeline.add(operator).collect(toArray())).toThrowError(
      `[flatMap() operator] Element to flatMap did not generate an array, it was ${JSON.stringify(source[0])}`
    );
  });
});
