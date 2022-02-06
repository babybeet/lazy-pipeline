import { limit } from '../../operators';
import { LazyPipeline } from '../../LazyPipeline';

import { groupBy } from './groupBy';

describe('groupBy()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should group elements by keys being dictated by the provided key extractor', () => {
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
    const pipeline = LazyPipeline.from(source);
    const stage = groupBy<typeof source[0], string>(e => e.city);
    const result = pipeline.collect(stage);
    const expected = new Map([
      ['Cool City', [source[0], source[1]]],
      ['Awesome City', [source[2]]],
      ['Sad City', [source[3]]]
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
    const stage = groupBy<typeof source[0], string>(e => e.city);
    const consumeSpy = jest.spyOn(stage, 'consume');
    const result = pipeline.collect(stage);
    const expected = new Map();

    expect(result).toEqual(expected);
    expect(consumeSpy).not.toHaveBeenCalled();
  });

  test('3. should map each grouped element according to the provided value extractor', () => {
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
    const pipeline = LazyPipeline.from(source);
    const stage = groupBy<typeof source[0], string, string>(
      e => e.city,
      e => e.name
    );
    const result = pipeline.collect(stage);
    const expected = new Map([
      ['Cool City', [source[0].name, source[1].name]],
      ['Awesome City', [source[2].name]],
      ['Sad City', [source[3].name]]
    ]);

    expect(result).toEqual(expected);
  });
});
