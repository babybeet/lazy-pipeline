import { LazyPipeline } from '../../LazyPipeline';

import { forEach } from './forEach';

describe('forEach()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('1. should run the provided action on each pipeline element', () => {
    const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pipeline = LazyPipeline.from(source);
    const actionMock = jest.fn();

    pipeline.collect(forEach(actionMock));

    expect(actionMock).toHaveBeenCalledTimes(source.length);
  });

  test('2. should not run the provided action when pipeline has no elements', () => {
    const source = [] as [];
    const pipeline = LazyPipeline.from(source);
    const actionMock = jest.fn();

    pipeline.collect(forEach(actionMock));

    expect(actionMock).not.toHaveBeenCalled();
  });
});
