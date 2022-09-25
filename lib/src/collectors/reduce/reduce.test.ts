import { LazyPipeline } from '../../LazyPipeline';

import { reduce } from './reduce';

describe('reduce()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should reduce the pipeline elements into a final result', () => {
    const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pipeline = LazyPipeline.from(source);
    const stage = reduce<number>((accumulator, next) => Math.max(accumulator, next));
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);
    const expected = source.reduce((accumulator, next) => Math.max(accumulator, next));

    expect(result).toBe(9);
    expect(result).toEqual(expected);
    expect(consumeSpy).toHaveBeenCalledTimes(source.length);
  });

  test('2. should reduce the pipeline elements into a final result, taking into account the provided initial value', () => {
    const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pipeline = LazyPipeline.from(source);
    const stage = reduce<number, number>((accumulator, next) => Math.min(accumulator, next), -20);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);
    const expected = source.reduce((accumulator, next) => Math.min(accumulator, next), -20);

    expect(result).toBe(-20);
    expect(result).toEqual(expected);
    expect(consumeSpy).toHaveBeenCalledTimes(source.length);
  });

  test('3. should return the provided initial value when pipeline has no elements', () => {
    const source = [] as number[];
    const pipeline = LazyPipeline.from(source);
    const stage = reduce<number, number>((accumulator, next) => Math.min(accumulator, next), -20);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);
    const expected = source.reduce((accumulator, next) => Math.min(accumulator, next), -20);

    expect(result).toBe(-20);
    expect(result).toEqual(expected);
    expect(consumeSpy).not.toHaveBeenCalled();
  });

  test('4. should throw an error when pipeline has no elements and no initial value is provided', () => {
    const source = [] as number[];
    const pipeline = LazyPipeline.from(source);
    const stage = reduce<number, number>((accumulator, next) => Math.min(accumulator, next));
    const consumeSpy = jest.spyOn(stage, 'consume');

    expect(() => pipeline.collect(stage)).toThrow(
      '[reduce() collector] Pipeline has no elements, and no initial value was provided'
    );
    expect(consumeSpy).not.toHaveBeenCalled();
  });

  test('5. should not throw an error when pipeline has no elements and an initial value is provided', () => {
    const source = [] as number[];
    const pipeline = LazyPipeline.from(source);
    const stage = reduce<number, number>((accumulator, next) => Math.min(accumulator, next), 100);
    const consumeSpy = jest.spyOn(stage, 'consume');

    expect(() => pipeline.collect(stage)).not.toThrow();
    expect(consumeSpy).not.toHaveBeenCalled();

    pipeline.resume();
    expect(pipeline.collect(stage)).toBe(100);
  });
});
