import { toArray } from './collectors';
import { LazyPipeline } from './LazyPipeline';
import { distinct, limit, map, sorted } from './operators';

describe('LazyPipeline', () => {
  test('1. Should evaluate the added stages when the terminal stage is triggered', () => {
    const source = [2, 4, 5, 9, 6, 8, 10, 2, 4, 3];
    const pipeline = LazyPipeline.from(source);
    const result = pipeline
      .add(
        map(e => e + 1),
        distinct(),
        sorted((left, right) => right - left),
        limit(3)
      )
      .collect(toArray());
    const expected = Array.from(new Set(source))
      .map(e => e + 1)
      .sort((left, right) => right - left)
      .slice(0, 3);

    expect(result).toEqual(expected);
  });

  test('2. Should not evaluate the added stages before the terminal stage is triggered', () => {
    const source = [2, 4, 5, 9, 6, 8, 10, 2, 4, 3];
    const pipeline = LazyPipeline.from(source);

    const mapOperator = map<number, number>(e => e + 1);
    const mapConsumeSpy = jest.spyOn(mapOperator, 'consume');

    const distinctOperator = distinct<number>();
    const distinctConsumeSpy = jest.spyOn(distinctOperator, 'consume');

    const sortedOperator = sorted<number>((left, right) => right - left);
    const sortedConsumeSpy = jest.spyOn(sortedOperator, 'consume');

    const limitOperator = limit(3);
    const limitConsumeSpy = jest.spyOn(limitOperator, 'consume');

    pipeline.add(mapOperator, distinctOperator, sortedOperator, limitOperator);

    expect(mapConsumeSpy).not.toBeCalled();
    expect(distinctConsumeSpy).not.toBeCalled();
    expect(sortedConsumeSpy).not.toBeCalled();
    expect(limitConsumeSpy).not.toBeCalled();
  });

  test('3. Should collect all elements into an array when #toArray() is called', () => {
    const source = [2, 4, 5, 9, 6, 8, 10, 2, 4, 3];
    const pipeline = LazyPipeline.from(source);
    const result = pipeline
      .add(
        map(e => e + 1),
        distinct(),
        sorted((left, right) => right - left),
        limit(3)
      )
      .toArray();
    const expected = Array.from(new Set(source))
      .map(e => e + 1)
      .sort((left, right) => right - left)
      .slice(0, 3);

    expect(result).toEqual(expected);
  });

  test('4. Should throw an error if collect() is called again without calling reset() first', () => {
    const source = [2, 4, 5, 9, 6, 8, 10, 2, 4, 3];
    const pipeline = LazyPipeline.from(source);

    pipeline
      .add(
        map(e => e + 1),
        distinct(),
        sorted((left, right) => right - left),
        limit(3)
      )
      .toArray();

    expect(() => pipeline.collect(toArray())).toThrow(
      'Pipeline has already been consumed, please call reset() before attempting to consume this pipeline again'
    );
  });

  test('5. Should not throw an error when collect() is called after reset() had been called', () => {
    const source = [2, 4, 5, 9, 6, 8, 10, 2, 4, 3];
    const pipeline = LazyPipeline.from(source);
    const expected = Array.from(new Set(source))
      .map(e => e + 1)
      .sort((left, right) => right - left)
      .slice(0, 3);

    const result = pipeline
      .add(
        map(e => e + 1),
        distinct(),
        sorted((left, right) => right - left),
        limit(3)
      )
      .toArray();

    expect(result).toEqual(expected);

    pipeline.reset();
    expect(pipeline.collect(toArray())).toEqual(expected);
  });

  test('6. Should allow to update the data source to read from', () => {
    const source1 = [2, 4, 5, 9, 6, 8, 10, 2, 4, 3];
    const pipeline = LazyPipeline.from(source1);
    const expected1 = Array.from(new Set(source1))
      .map(e => e + 1)
      .sort((left, right) => right - left)
      .slice(0, 3);

    const result = pipeline
      .add(
        map(e => e + 1),
        distinct(),
        sorted((left, right) => right - left),
        limit(3)
      )
      .toArray();

    expect(result).toEqual(expected1);

    pipeline.reset();

    const source2 = [1, 5, 3, 2, 10, 9, 7];
    const expected2 = Array.from(new Set(source2))
      .map(e => e + 1)
      .sort((left, right) => right - left)
      .slice(0, 3);
    pipeline.readFrom(source2);
    expect(pipeline.collect(toArray())).toEqual(expected2);
  });

  test('7. Should throw an error when adding new stages to frozen pipeline', () => {
    const source = [2, 4, 5, 9, 6, 8, 10, 2, 4, 3];
    const pipeline = LazyPipeline.from(source);

    expect(() => pipeline.add(limit(3))).not.toThrow();
    expect(pipeline.toArray()).toHaveLength(3);

    pipeline.reset();

    expect(() => pipeline.add(map(e => e * 2))).toThrow(
      '[LazyPipeline] Pipeline has been frozen, please call unfreeze() before adding new intermediate stages'
    );
  });

  test('8. Should not throw an error when adding new stages to non-frozen pipeline', () => {
    const source = [2, 4, 5, 9, 6, 8, 10, 2, 4, 3];
    const pipeline = LazyPipeline.from(source);

    expect(() => pipeline.add(limit(3))).not.toThrow();
    expect(pipeline.toArray()).toHaveLength(3);

    pipeline.reset();
    pipeline.unfreeze();

    expect(() => pipeline.add(map(e => e * 2))).not.toThrow();
  });
});
