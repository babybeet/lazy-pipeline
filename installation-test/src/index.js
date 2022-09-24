"use strict";
/* eslint-disable newline-per-chained-call */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
exports.__esModule = true;
var lazy_pipeline_1 = require("lazy-pipeline");
var operators_1 = require("lazy-pipeline/operators");
var source = new Array(10000000).fill(undefined).map(function (_, index) { return index + 1; });
warmUp();
measure(runPipelineWithLazyPipelineLibrary, source);
measure(runPipelineWithNativeArray, source);
function warmUp(sum, iteration) {
    if (sum === void 0) { sum = 0; }
    if (iteration === void 0) { iteration = 1; }
    if (iteration === 10) {
        return sum;
    }
    for (var _i = 0, _a = new Array(20e6).fill(1); _i < _a.length; _i++) {
        var iterator = _a[_i];
        sum = iterator;
    }
    return warmUp(sum, iteration + 1);
}
function measure(fn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var timePerRun = [];
    for (var index = 0; index < 10; index++) {
        var now = performance.now();
        fn(args);
        timePerRun.push(performance.now() - now);
    }
    var averageTime = timePerRun.reduce(function (a, b) { return a + b; }) / timePerRun.length;
    console.log("".concat(fn.name, " took ").concat((averageTime / 1000).toFixed(5), " seconds on average"));
}
function runPipelineWithNativeArray(source) {
    source
        .filter(function (value) { return value % 2 === 0; })
        .map(function (value) { return ({ age: value }); })
        .sort(function (a, b) { return b.age - a.age; });
}
function runPipelineWithLazyPipelineLibrary(source) {
    lazy_pipeline_1.LazyPipeline.from(source)
        .add((0, operators_1.filter)(function (value) { return value % 2 === 0; }), (0, operators_1.map)(function (value) { return ({ age: value }); }), (0, operators_1.sorted)(function (a, b) { return b.age - a.age; }))
        .toArray();
}
