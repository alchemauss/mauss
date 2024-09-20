import type * as TS from '../typings/index.js';

/** Compares nullish values, sorting `null` and `undefined` to the end */
export function undefined(x: unknown, y: unknown): number {
	if (x == null && y == null) return 0;
	return (x == null && 1) || (y == null && -1) || 0;
}

/** Compares boolean values, prioritizing `true` over `false` */
export function boolean(x: boolean, y: boolean): number {
	return +y - +x;
}

/**
 * Put `(x, y)` for bigger number first, and `(y, x)` for smaller number first
 * @returns `y - x` which defaults to descending order
 */
export function number(x: number, y: number): number {
	return y - x;
}

/** Compares bigint values, defaults to ascending order */
export function bigint(x: bigint, y: bigint): number {
	return x < y ? -1 : x > y ? 1 : 0;
}

/** Compares symbols using its string values */
export function symbol(x: symbol, y: symbol): number {
	return x.toString().localeCompare(y.toString());
}

/** Compares string values using `.localeCompare` */
export function string(x: string, y: string): number {
	for (const [pattern, exp] of Object.entries(patterns)) {
		const fn = { date, time }[pattern.split(':')[0]];
		if (exp.test(x) && exp.test(y) && fn) return fn(x, y);
	}
	return x.localeCompare(y);
}

type Wildcard = TS.AnyFunction<[x: any, y: any], number>;

/** Compares generic object values using {@link inspect} */
export function object(x: object, y: object): number {
	if (x === null) return 1;
	if (y === null) return -1;
	return inspect(x, y);
}

const primitives = { string, number, bigint, boolean, symbol, undefined } as const;

/** Compares anything with anything */
export function wildcard(x: any, y: any): number {
	if (x == null) return 1;
	if (y == null) return -1;
	const [xt, yt] = [typeof x, typeof y];
	if (xt === 'function') return 0;

	if (xt !== yt || xt === 'object') {
		const xs = JSON.stringify(x);
		const ys = JSON.stringify(y);
		return string(xs, ys);
	}

	return (primitives[xt] as Wildcard)(x, y);
}

/**
 * Recursively compares common object properties until the first difference is found
 * @returns `0` if both objects are identical or completely different, otherwise their respective primitive difference
 */
export function inspect(
	x: Record<TS.IndexSignature, any>,
	y: Record<TS.IndexSignature, any>,
): number {
	const common = [...new Set([...Object.keys(x), ...Object.keys(y)])].filter(
		(k) => k in x && k in y && typeof x[k] === typeof y[k] && x[k] !== y[k],
	);
	for (
		let i = 0, key = common[i], data = typeof x[key];
		i < common.length && x[key] !== null && y[key] !== null;
		key = common[++i], data = typeof x[key]
	) {
		if (data === 'function') continue;
		if (data === 'object') return inspect(x[key], y[key]);
		const constrained: Wildcard = primitives[data];
		if (data in primitives) return constrained(x[key], y[key]);
	}
	return 0;
}

// ---- patterned ----

const patterns = {
	'date:complete': /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
	'date:time': /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/,
	date: /\d{4}-[01]\d-[0-3]\d/,
	time: /[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/,
} as const;

/** Compares date or date-like string values */
export function date(x: string | Date, y: string | Date) {
	return new Date(y).getTime() - new Date(x).getTime();
}

/** Compares time or time-like string values */
export function time(x: string | Date, y: string | Date) {
	return Date.parse(`2017/08/28 ${y}`) - Date.parse(`2017/08/28 ${x}`);
}

// ---- customized ----

type KeyValidator<Keys, Expected> = Keys extends [infer I extends string, ...infer R]
	? Expected & Record<I, KeyValidator<R, I extends keyof Expected ? Expected[I] : never>>
	: Expected;

/**
 * A higher-order function that accepts a string as an identifier and an optional comparator function, it breaks up the identifier described by the dot (`.`) character and returns a curried function that accepts `(x, y)` with an object defined by the identifier.
 *
 * The optional comparator can be used when you have an existing custom sort function, e.g. in combination with `compare.order` to sort a set of string.
 *
 * @example
 *
 * ```javascript
 * import * as compare from 'mauss/compare';
 *
 * const posts = [
 * 	{ date: { month: 'March' } },
 * 	{ date: { month: 'June' } },
 * 	{ date: { month: 'May' } },
 * 	{ date: { month: 'April' } },
 * 	{ date: { month: 'January' } },
 * 	{ date: { month: 'June' } },
 * 	{ date: { month: 'February' } },
 * ];
 *
 * const months = [
 * 	'January',
 * 	'February',
 * 	'March',
 * 	'April',
 * 	'May',
 * 	'June',
 * 	'July',
 * 	'August',
 * 	'September',
 * 	'October',
 * 	'November',
 * 	'December',
 * ];
 *
 * posts.sort(compare.key('date.month', compare.order(months)));
 * ```
 */
export function key<
	Inferred extends Record<TS.IndexSignature, any>,
	Identifier extends keyof Inferred = TS.Paths<Inferred>,
>(identifier: string & Identifier, comparator?: Wildcard) {
	const trail = identifier.split('.');
	const drill = (o: Inferred) => trail.reduce((ret, prop) => ret[prop], o);

	type Properties = TS.Split<Identifier, '.'>;
	return <X extends Inferred, Y extends Inferred>(
		x: TS.WhenAny<keyof X, X, KeyValidator<Properties, X>>,
		y: TS.WhenAny<keyof Y, Y, KeyValidator<Properties, Y>>,
	) => (comparator || wildcard)(drill(x as Inferred), drill(y as Inferred));
}

/**
 * A higher-order function that accepts an array of strings and returns a comparator function that sorts the strings in the order they appear in the array.
 */
export function order(weights: readonly string[]): Wildcard {
	const m: Record<string, number> = {};
	weights.forEach((v, i) => (m[v] = i));
	return (x, y) => m[x] - m[y];
}
