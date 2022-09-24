/* eslint-disable newline-per-chained-call */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */

import { LazyPipeline } from 'lazy-pipeline';
import { filter, map, sorted } from 'lazy-pipeline/operators';

const source = new Array(10_000_000).fill(undefined).map((_, index) => index + 1);

benchmark(runPipelineWithLazyPipelineLibrary, source);
benchmark(runPipelineWithNativeArray, source);

function benchmark(fn: (...args: any[]) => void, ...args: any[]) {
  warmUp();

  const timePerRun = [];
  for (let index = 0; index < 10; index++) {
    const now = performance.now();
    fn(args);
    timePerRun.push(performance.now() - now);
  }

  const averageTime = timePerRun.reduce((a, b) => a + b) / timePerRun.length;

  console.log(`${fn.name} took ${(averageTime / 1000).toFixed(5)} seconds on average`);
}

function warmUp(sum = 0, iteration = 1): number {
  if (iteration === 10) {
    return sum;
  }
  for (const iterator of new Array(20e6).fill(1)) {
    sum = iterator;
  }
  return warmUp(sum, iteration + 1);
}

function runPipelineWithNativeArray(source: number[]) {
  source
    .filter(value => value % 2 === 0)
    .map(value => ({ age: value }))
    .sort((a, b) => b.age - a.age);
}

function runPipelineWithLazyPipelineLibrary(source: number[]) {
  LazyPipeline.from(source)
    .add(
      filter(value => value % 2 === 0),
      map(value => ({ age: value })),
      sorted((a, b) => b.age - a.age)
    )
    .toArray();
}
