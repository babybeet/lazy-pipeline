# `lazy-pipeline`

A reusable, tree-shakable lazy pipeline with functional APIs

## Installation

```shell
npm i -S lazy-pipeline
```

## Table of contents

- [What is a reusable, lazy pipeline?](#what-is-a-reusable-lazy-pipeline)
- [Terminologies](#terminologies)
- [Advantages of tree-shakeable, functional APIs](#advantages-of-tree-shakeable-functional-apis)
- [How to add a new operator](#how-to-add-a-new-operator)
- [How to add a new collector](#how-to-add-a-new-collector)
- [Built-in collectors](./lib/src/collectors/)
- [Built-in operators](./lib/src/operators/)

## What is a reusable, lazy pipeline?

Consider the following common pattern with arrays

```typescript
const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // 10 elements

source
  .map(value => value + 1) // Iterate 10 times and add 1 to each number each time
  .filter(value => value % 2 === 0) // Iterate 10 times and filter out any odd numbers
  .reduce((left, right) => left + right); // Iterate 5 times and sum up the numbers
```

The combination of `map`, `filter`, and `reduce` operations above constitutes a pipeline, each operation executes
**eagerly** as soon as it is added, but most notably, each operation runs as many times as there are elements.

The example above would look similar to the following using `for-of` loops:

```typescript
const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// map(value => value + 1)
const mappedValues = [];
for (const value of source) {
  mappedValues.push(value);
}

// filter(value => value % 2 === 0)
const filteredValues = [];
for (const value of mappedValues) {
  if (value % 2 === 0) {
    filteredValues.push(value);
  }
}

// reduce((left, right) => left + right)
let sum = 0;
for (const value of filteredValues) {
  sum += value;
}
```

As you can see, it needs to iterate through the entire array every time an operation (`map`, `filter`, and `reduce`) is
added which is not something that we want.

<br/>

Now consider a similar pipeline using `lazy-pipeline` APIs.

```typescript
import { LazyPipeline } from 'lazy-pipeline';
import { filter, map } from 'lazy-pipeline/operators';
import { sum } from 'lazy-pipeline/collectors';

const source = [0, 2, 1, 3, 5, 4, 6, 8];

LazyPipeline.from(source) // Creating a new pipeline object
  // Begin adding operations to this pipeline
  .add(
    map(value => value + 1), // Adding a mapping stage
    filter(value => value % 2 === 0) // Adding a filtering stage
  )
  // Telling the pipeline to start executing all of the added stages (operations)
  .collect(
    sum() // Adding a terminal stage that sums all elements in the pipeline
  );
```

This second example is no different than the first one in terms of the final result, however, there are a few things
that distinguish it from the first example. First of all, you can add as many intermediate stages (`map`, and `filter`
or [any intermediate stages](./lib/src/operators)) to the pipeline, those stages won't be executed until `collect()` is
called, that's the reason for its lazy evaluation nature, `collect()` expects a terminal stage which is the final stage
to produce the result, these terminal stages are called collectors because their job is to **collect** the remaining
pipeline elements into some final result container. Second of all, all stages (`map`, `filter` and `sum` in this
example) run in the same iteration which is much more efficient as compared to the first example, the second example
would look similar to the following with a regular `for-of` loop:

```typescript
const source = [0, 2, 1, 3, 5, 4, 6, 8];

let sum = 0;
for (const value of source) {
  const mappedValue = value + 1;
  if (mappedValue % 2 === 0) {
    sum += mappedValue;
  }
}

return sum;
```

As you can see, we only need to iterate once per element to evaluate all of our operations which is obviously much more
efficient.

The most interesting bit of `lazy-pipeline` module is its reusability feature. After constructing your pipeline, and
adding any number of intermediates stages to it, you can pass this pipeline object around an reuse it on as many
iterable data sources as desired, but keep it mind that after each call to `collect()` to get the result, the pipeline
will be frozen to prevent any new stages from being added to it, to unfreeze it, simply call `unfreeze()` on the same
pipeline instance, for example:

```typescript
import { LazyPipeline } from 'lazy-pipeline';
import { filter, map, skip } from 'lazy-pipeline/operators';
import { findFirst, max, min } from 'lazy-pipeline/collectors';

const source1 = [0, 2, 1, 3, 5, 4, 6, 8];

const pipeline = LazyPipeline.from(source1).add(
  map(value => value + 1), // (1)
  filter(value => value % 2 === 0) // (2)
);

const maxNumber = pipeline.collect(
  /*
   * max() returns a collector that finds the max number by default, if elements in the pipeline
   * are not numbers, then you must provide a comparator to `max()` to return the max element.
   */
  max()
);

// Calling reset() is required before reusing the same pipeline instance
pipeline.reset();

// Calling unfreeze() so that we can add new stages to this pipeline, otherwise, it will throw an error
pipeline.unfreeze();

const minNumber = pipeline
  .add(
    // map(...) and filter(...) from (1) and (2) will execute before this new limit(5) stage
    limit(5) // (3)
  )
  .collect(
    /*
     * min() returns a collector that finds the min number by default, if elements in the pipeline
     * are not numbers, then you must provide a comparator to `min()` to return the min element.
     */
    min()
  );

// Calling reset() again so that we can calculate a new result
pipeline.reset();

// Have to unfreeze so that we can add a new `skip()` stage to it
pipeline.unfreeze();

const source2 = [1, 10, 100, 1000, 10000];
const firstElement = pipeline
  .add(
    // Similarly, map(...) and filter(...) and limit(...) from (1), (2), and (3) will execute before skip(2) does
    skip(2) // (4)
  )
  .collect(
    /*
     * findFirst() returns the very first element in the pipeline, or `undefined` when pipeline has no elements
     */
    findFirst() // (5)
  );
```

Once again, all stages `(1)`, `(2)`, `(3)`, `(4)` and `(5)` from the example above will _all run in the same iteration_.

## Terminologies

- Pipeline: A series of stages that execute in order and in the same iteration, and end with a terminal stage that
  returns a result. Once the pipeline has been consumed by triggering a terminal stage with `collect()`, it cannot be
  consumed again until `reset()` is called, otherwise, the pipeline will throw an error to indicate as such.
- Stage: A particular operation that executes on each element in the pipeline.
- [Intermediate stage](./lib/src/stages/IntermediateStage.ts): A stage that performs some transformation on each element
  in the pipeline and forward the new element to the next stage in line downstream. The built-in intermediate stages'
  creators are located inside [operators module](./lib/src/operators).
- [Terminal stage](./lib/src/stages/TerminalStage.ts): The final stage that _collects_ all remaining elements in the
  pipeline to produce a result. Each pipeline doesn't execute until a terminal stage is triggered by calling `collect()`
  which expects a `TerminateStage` object. Terminal stages' creators are located inside
  [collectors module](./lib/src/collectors/).
- [Collector](./lib/src/collectors): A function that returns a new object instance of type
  [`TerminalStage`](./lib/src/stages/TerminalStage.ts).
- [Operator](./lib/src/operators/): A function that returns a new object instance of type
  [`IntermediateStage`](./lib/src/stages/IntermediateStage.ts).

## Advantages of tree-shakeable, functional APIs

All of the stages (intermediate and terminal) are created using standalone functions, this not only makes the APIs
easier to use, it also allows bundling tools to effortlessly tree-shake those functions that are not imported into your
application. Additionally, with a functional programming model, it's straightforward to extend this library with your
own operators and collectors.

## How to add a new operator

To add a new operator, create a function that returns a new object instance of type
[`IntermediateStage`](./lib/src/stages/IntermediateStage.ts) each time it's called.

As an example, let's create an operator that increments each number in the pipeline by some provided value:

```typescript
import { IntermediateStage } from 'lazy-pipeline/stages';

class IncrementByStage<IN extends number> extends IntermediateStage<IN, number> {
  constructor(private readonly _valueToIncrementBy: number) {
    super();
  }

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    this._throwErrorIfNotNumber(element);
    this._downstream.consume(element + this._valueToIncrementBy, hasMoreDataUpstream);
  }

  private _throwErrorIfNotNumber(element: IN) {
    if (typeof element !== 'number') {
      throw new Error(
        `[incrementBy() operator] Numbers expected, erroneous pipeline element received was ${JSON.stringify(element)}`
      );
    }
  }
}

/**
 * Return an intermediate stage that increments each pipeline numeric element by `value`, if some element
 * is not numeric, then an error will occur.
 *
 * @param value The value to increment each each by
 * @returns
 */
export function incrementBy<IN extends number>(value: number): IntermediateStage<IN, number> {
  if (typeof value !== 'number') {
    throw new Error(
      `[incrementBy() operator] The provided value to increment by is not a number, it was ${JSON.stringify(value)}`
    );
  }
  return new IncrementByStage<IN>(value);
}
```

To use the new operator, simply add it to the pipeline, for example:

```typescript
import { LazyPipeline } from 'lazy-pipeline';
import { sum } from 'lazy-pipeline/collectors';

import { incrementBy } from './incrementBy';

const result = LazyPipeline.from([1, 2, 3, 4, 5]).add(incrementBy(10)).collect(sum());
```

To view all built-in operators, please see the [operators module](./lib/src/operators/)

## How to add a new collector

To add a new collector, create a function that returns a new object instance of type
[`TerminalStage`](./lib/src/stages/TerminalStage.ts) each time it's called. Each terminal stage must additionally
implement `get()` method to return the final result when the pipeline terminates.

As an example, let's create a collector that multiplies all numbers in the pipeline:

```typescript
import { TerminalStage } from 'lazy-pipeline/stages';

class MultiplyStage<IN extends number> extends TerminalStage<IN, number> {
  private _product = 1;

  override consume(element: IN, hasMoreDataUpstream: boolean): void {
    this._throwErrorIfNotNumber(element);
    this._product *= element;
  }

  private _throwErrorIfNotNumber(element: IN) {
    if (typeof element !== 'number') {
      throw new Error(
        `[multiply() collector] Numbers expected, erroneous pipeline element received was ${JSON.stringify(element)}`
      );
    }
  }

  override get(): number {
    return this._product;
  }
}

/**
 * Return a terminal stage that multiplies all pipeline elements together, if some element
 * is not numeric, then an error will occur.
 *
 * @param value The value to increment each each by
 * @returns
 */
export function multiply<IN extends number>(): IntermediateStage<IN, number> {
  return new MultiplyStage<IN>(value);
}
```

To use the new collector, simply provide it to `collect()` as followed:

```typescript
import { LazyPipeline } from 'lazy-pipeline';
import { filter, map } from 'lazy-pipeline/operators';

import { multiply } from './multiply';

const result = LazyPipeline.from([1, 2, 3, 4, 5])
  .add(
    filter(e => e % 2 === 0),
    map(e => e * e)
  )
  .collect(multiply());
```

To view all builtin collectors, please see the [collectors module](./lib/src/collectors/)
