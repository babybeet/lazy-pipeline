import { toArray } from '../../collectors';
import { LazyPipeline } from '../../LazyPipeline';
import { filter } from '../filter';

import { distinctBy } from './distinctBy';

describe('distinctBy()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should only let distinct elements thru by the provided distinctness checker', () => {
    const source = [20, 2, 4, 6, 8, 10, 10, 8, 6, 12].map(e => ({ age: e }));
    const pipeline = LazyPipeline.from(source);
    const stage = distinctBy<{ age: number }, number>(e => e.age);
    const result = pipeline.add(stage).collect(toArray());

    expect(result).toEqual([20, 2, 4, 6, 8, 10, 12].map(e => ({ age: e })));
  });

  test('2. should return an empty array when pipeline has no elements', () => {
    const source = [20, 2, 4, 6, 8, 10, 10, 8, 6, 12].map(e => ({ age: e }));
    const pipeline = LazyPipeline.from(source);
    const stage = distinctBy<{ age: number }, number>(e => e.age);
    const result = pipeline
      .add(
        filter(() => false),
        stage
      )
      .collect(toArray());

    expect(result).toHaveLength(0);
  });
});
