import type { WhenAny, WhenUnknown } from '../typings/comparators.js';

const patterns = {
	'date:complete': /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
	'date:time': /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/,
	date: /\d{4}-[01]\d-[0-3]\d/,
	time: /[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/,
};
export function date(x: string | Date, y: string | Date) {
	return new Date(y).getTime() - new Date(x).getTime();
}
export function time(x: string | Date, y: string | Date) {
	return Date.parse(`2017/08/28 ${y}`) - Date.parse(`2017/08/28 ${x}`);
}
const patterned = { date, time };

type Wildcard = (x: any, y: any) => number;

export function key<Identifier extends string>(identifier: Identifier, comparator?: Wildcard) {
	return <X extends Record<string, any>, Y extends Record<string, any>>(
		x: WhenAny<X[Identifier], X, WhenUnknown<X[Identifier], never, X>>,
		y: WhenAny<Y[Identifier], Y, WhenUnknown<Y[Identifier], never, Y>>
	) => (comparator || wildcard)(x[identifier], y[identifier]);
}
export function order(weights: string[]): Wildcard {
	const m: Record<string, number> = {};
	weights.forEach((v, i) => (m[v] = i));
	return (x, y) => m[x] - m[y];
}

export function undefined(x: unknown, y: unknown): number {
	if (x == null && y == null) return 0;
	return (x == null && 1) || (y == null && -1) || 0;
}
export function boolean(x: boolean, y: boolean): number {
	return +y - +x;
}
export function number(x: number, y: number): number {
	return y - x;
}
export function bigint(x: bigint, y: bigint): number {
	return x < y ? -1 : x > y ? 1 : 0;
}
export function symbol(x: symbol, y: symbol): number {
	return x.toString().localeCompare(y.toString());
}
export function string(x: string, y: string): number {
	for (const [pattern, exp] of Object.entries(patterns)) {
		const [type] = pattern.split(':') as [keyof typeof patterned];
		if (exp.test(x) && exp.test(y)) return patterned[type](x, y);
	}
	return x.localeCompare(y);
}
export function object(x: object, y: object): number {
	if (x === null) return 1;
	if (y === null) return -1;
	return comparator(x, y);
}
const primitives = { undefined, boolean, number, bigint, symbol, string, object };

export function wildcard(x: any, y: any): number {
	if (x == null) return 1;
	if (y == null) return -1;
	const [xt, yt] = [typeof x, typeof y];
	if (xt === 'function') return 0;

	if (xt !== yt) {
		const xs = JSON.stringify(x);
		const ys = JSON.stringify(y);
		return string(xs, ys);
	}

	const constrained: Wildcard = primitives[xt];
	return constrained(x, y);
}

export function comparator(x: Record<any, any>, y: Record<any, any>): number {
	const common = [...new Set([...Object.keys(x), ...Object.keys(y)])].filter(
		(k) => k in x && k in y && typeof x[k] === typeof y[k] && x[k] !== y[k]
	);
	for (
		let i = 0, key = common[i], data = typeof x[key];
		i < common.length && x[key] !== null && y[key] !== null;
		key = common[++i], data = typeof x[key]
	) {
		if (data === 'function') continue;
		if (data === 'object') return comparator(x[key], y[key]);
		const constrained: Wildcard = primitives[data];
		if (data in primitives) return constrained(x[key], y[key]);
	}
	return 0;
}
