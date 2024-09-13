import { curry, pipe } from './index.js';

declare function expect<T>(v: T): void;

(/* curry */) => {
	const sum = (a: number, b: number, c: number) => a + b + c;

	expect<number>(curry(sum)(1, 1, 1));
	expect<number>(curry(sum)(1, 1)(1));
	expect<number>(curry(sum)(1)(1, 1));
	expect<number>(curry(sum)(1)(1)(1));

	// @ts-expect-error
	expect<number>(curry(sum)(1, 1, 1, 1));
	// @ts-expect-error
	expect<number>(curry(sum)(1)(1)(1)(1));
};

(/* pipe */) => {
	const name = <T extends { name: string }>(v: T) => v.name;
	const cap = (v: string) => v.toUpperCase();
	const split = (v: string) => v.split('');

	pipe(cap);
	pipe(cap, split);
	pipe(name, split);
	pipe(name, cap, split);
	pipe(name, cap, cap, split);

	pipe(
		(v: boolean) => +v,
		(v: number) => (v > 0 ? 'y' : 'n'),
		(v: string) => v === 'y',
	);

	// ---- errors ----

	// @ts-expect-error - error on name
	pipe(split, name);
	// @ts-expect-error - error on name
	pipe(split, name, cap);
	// @ts-expect-error - error on cap
	pipe(split, cap, name);
	// @ts-expect-error - error on name
	pipe(name, cap, name);
	// @ts-expect-error - error on 2nd split
	pipe(name, split, split);
};
