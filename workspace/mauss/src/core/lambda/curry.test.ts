import curry from './curry.js';

declare function expect<T>(v: T): void;

const sum = (a: number, b: number, c: number) => a + b + c;

expect<number>(curry(sum)(1, 1, 1));
expect<number>(curry(sum)(1, 1)(1));
expect<number>(curry(sum)(1)(1, 1));
expect<number>(curry(sum)(1)(1)(1));

// @ts-expect-error
expect<number>(curry(sum)(1, 1, 1, 1));
// @ts-expect-error
expect<number>(curry(sum)(1)(1)(1)(1));
