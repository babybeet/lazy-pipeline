import { limit } from '../../operators';
import { LazyPipeline } from '../../LazyPipeline';

import { toObject } from './toObject';

describe('toObject()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return a plain object whose keys are dictated by the provided key extractor', () => {
    const source = [
      {
        id: 'id-1',
        city: 'Cool City'
      },
      {
        id: 'id-2',
        city: 'Cool City'
      },
      {
        id: 'id-3',
        city: 'Awesome City'
      },
      {
        id: 'id-4',
        city: 'Sad City'
      }
    ];
    const pipeline = LazyPipeline.from(source);
    const collector = toObject<typeof source[0]>(e => e.id);
    const result = pipeline.collect(collector);
    const expected = source.reduce((accumulator, next) => {
      accumulator[next.id] = next;
      return accumulator;
    }, {});

    expect(result).toEqual(expected);
  });

  test('2. should return an empty object when pipeline has no elements', () => {
    const source = [
      {
        name: 'Name 1',
        city: 'Cool City'
      },
      {
        name: 'Name 2',
        city: 'Cool City'
      },
      {
        name: 'Name 3',
        city: 'Awesome City'
      },
      {
        name: 'Name 4',
        city: 'Sad City'
      }
    ];
    const pipeline = LazyPipeline.from(source).add(limit(0));
    const collector = toObject<typeof source[0]>(e => e.city);
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);
    const expected = {};

    expect(result).toEqual(expected);
    expect(consumeSpy).not.toBeCalled();
  });

  test('3. should map each pipeline element according to the provided value extractor', () => {
    const source = [
      {
        id: 'id-1',
        city: 'Cool City',
        name: 'Name 1'
      },
      {
        id: 'id-2',
        city: 'Cool City',
        name: 'Name 2'
      },
      {
        id: 'id-3',
        city: 'Awesome City',
        name: 'Name 3'
      },
      {
        id: 'id-4',
        city: 'Sad City',
        name: 'Name 4'
      }
    ];
    const pipeline = LazyPipeline.from(source);
    const collector = toObject<typeof source[0], string>(
      e => e.id,
      e => e.name
    );
    const result = pipeline.collect(collector);
    const expected = source.reduce((accumulator, next) => {
      accumulator[next.id] = next.name;
      return accumulator;
    }, {});

    expect(result).toEqual(expected);
  });
});
