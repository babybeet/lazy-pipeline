import { limit } from '../../operators';
import { LazyPipeline } from '../../LazyPipeline';

import { toMap } from './toMap';

describe('toMap()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should return a `Map` whose keys are dictated by the provided key extractor', () => {
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
    const collector = toMap<typeof source[0]>(e => e.id);
    const result = pipeline.collect(collector);
    const expected = new Map([
      ['id-1', source[0]],
      ['id-2', source[1]],
      ['id-3', source[2]],
      ['id-4', source[3]]
    ]);

    expect(result).toEqual(expected);
  });

  test('2. should return an empty map when pipeline has no elements', () => {
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
    const collector = toMap<typeof source[0]>(e => e.city);
    const consumeSpy = jest.spyOn(collector, 'consume');
    const result = pipeline.collect(collector);
    const expected = new Map();

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
    const collector = toMap<typeof source[0], string>(
      e => e.id,
      e => e.name
    );
    const result = pipeline.collect(collector);
    const expected = new Map([
      ['id-1', source[0].name],
      ['id-2', source[1].name],
      ['id-3', source[2].name],
      ['id-4', source[3].name]
    ]);

    expect(result).toEqual(expected);
  });
});
