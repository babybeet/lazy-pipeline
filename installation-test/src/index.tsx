/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import { LazyPipeline } from 'lazy-pipeline';
import { toArray } from 'lazy-pipeline/collectors';
import { dropWhile } from 'lazy-pipeline/operators';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

const pipeline = LazyPipeline.from([0, 2, 4, 6, 8, 10, 11, 10, 8, 6, 12, 13, 17]).add(dropWhile(e => e <= 4));
const result = pipeline.collect(toArray());

console.log(result);
