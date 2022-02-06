Collectors are functions that return a new object instance of type [`TerminalStage`](../stages/TerminalStage.ts).

## Example usage

```typescript
import { LazyPipeline } from 'lazy-pipeline';
import { allMatch } from 'lazy-pipeline/collectors';
import { limit } from 'lazy-pipeline/operators';

const source = [2, 4, 6, 8, 10];

const result = LazyPipeline.from(source)
  .add(
    /*
     * Only take the first 3 elements.
     */
    limit(3)
  )
  .collect(
    /**
     * `allMatch() collector returns whether all remaining elements in this pipeline are even numbers.
     */
    allMatch(e => e % 2 === 0)
  );

console.log(result); // Outputs `true`.
```

<br/>

## Built-in collectors

| Collector                               | Description                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`allMatch`](./allMatch/allMatch.ts)    | Return a terminal stage that evaluates whether all elements in the pipeline match the provided predicate.                                                                                                                                                                                                                              |
| [`anyMatch`](./anyMatch/anyMatch.ts)    | Return a terminal stage that evaluates whether at least one element in the pipeline matches the provided predicate.                                                                                                                                                                                                                    |
| [`average`](./average/average.ts)       | Return a terminal stage that calculates the average of all numeric elements in the pipeline. This collector throws an error if at least one element is not numeric.                                                                                                                                                                    |
| [`count`](./count/count.ts)             | Return a terminal stage that calculates the total number of elements in the pipeline.                                                                                                                                                                                                                                                  |
| [`findFirst`](./findFirst/findFirst.ts) | Return a short-circuiting terminal stage that retrieves the very first element encountered in the pipeline. The pipeline will terminate as soon as an element is found due to its short-circuiting nature, otherwise, `undefined` is returned.                                                                                         |
| [`findLast`](./findLast/findLast.ts)    | Return a terminal stage that finds and retrieves the very last element in the pipeline. If no such element exists, `undefined` is returned.                                                                                                                                                                                            |
| [`groupBy`](./groupBy/groupBy.ts)       | Return a terminal stage that groups pipeline elements by the keys returned by `keyExtractor` argument. Elements that return the same key will be grouped together in an array used as the value in the mapping. <br/><br/>Optionally, each grouped element can be transformed by providing a second argument.                          |
| [`max`](./max/max.ts)                   | Return a terminal stage that finds the max element in the pipeline. By default, if no comparator function is provided, it assumes every element to be numeric, if at least one element is not numeric, then it will throw an error. If a comparator function is provided, it will use the returned value of the comparator as the max. |
| [`min`](./min/min.ts)                   | Return a terminal stage that finds the min element in the pipeline. By default, if no comparator function is provided, it assumes every element to be numeric, if at least one element is not numeric, then it will throw an error. If a comparator function is provided, it will use the returned value of the comparator as the min. |
| [`noneMatch`](./noneMatch/noneMatch.ts) | Return a terminal stage that checks whether no elements in this pipeline match the provided predicate.                                                                                                                                                                                                                                 |
| [`sum`](./sum/sum.ts)                   | Return a terminal stage that calculates the sum of all elements in this pipeline. It assumes that every element is numeric, otherwise, it will throw an error when at least one element is not numeric.                                                                                                                                |
| [`toArray`](./toArray/toArray.ts)       | Return a terminal stage that collects all elements in the pipeline into an array.                                                                                                                                                                                                                                                      |
| [`toMap`](./toMap/toMap.ts)             | Return a terminal stage that puts each element into a map whose keys are extracted from `keyExtractor` argument. <br/><br/>Optionally, each element can be transformed by providing a second argument before being stored in the resulting map.                                                                                        |
| [`toObject`](./toObject/toObject.ts)    | Return a terminal stage that puts each element into a plain object whose keys are extracted from `keyExtractor` argument. <br/><br/>Optionally, each element can be transformed by providing a second argument before being stored in the resulting object.                                                                            |
