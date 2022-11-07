import * as patterned from './patterned.js';

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
		const type = pattern.split(':')[0] as keyof typeof patterned;
		if (exp.test(x) && exp.test(y)) return patterned[type](x, y);
	}
	return x.localeCompare(y);
}

const patterns = Object.freeze({
	'date:complete': /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
	'date:time': /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/,
	date: /\d{4}-[01]\d-[0-3]\d/,
	time: /[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/,
});
