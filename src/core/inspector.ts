import type { Filter } from '../typings/enhancer';
import type { Split } from '../typings/operation';

type Wildcard = (x: any, y: any) => number;
type Primitives = {
	undefined: (x: undefined, y: undefined) => number;
	boolean: (x: boolean, y: boolean) => number;
	number: (x: number, y: number) => number;
	string: (x: string, y: string) => number;
	bigint: (x: bigint, y: bigint) => number;
	symbol: (x: symbol, y: symbol) => number;
	object: (x: object, y: object) => number;
};

const patterns = [
	['date:complete', /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/],
	['date:time', /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/],
	['date', /\d{4}-[01]\d-[0-3]\d/],
	['time', /[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/],
] as const;

type PatternKeys = typeof patterns[number][0];
type Categories = Split<PatternKeys, ':'>[0];
type Prefixed<K extends string> = K extends `${infer P}:${string}` ? Filter<P, Categories> : K;
type Comparisons = Primitives & { [K in Prefixed<PatternKeys>]: (x: string, y: string) => number };
export function compare(
	order: 'asc' | 'dsc'
): Comparisons & { wildcard: (x: any, y: any) => number } {
	const up = order === 'asc';

	const dd = (t: string) => `2017/08/28 ${t}`;
	const dt = (dx: string, dy: string) => new Date(dx).getTime() - new Date(dy).getTime();
	const dp = (tx: string, ty: string) => Date.parse(dd(tx)) - Date.parse(dd(ty));

	const discriminator = comparator(order);
	return {
		date: (x, y) => (up ? dt(x, y) : dt(y, x)),
		time: (x, y) => (up ? dp(x, y) : dp(y, x)),
		// primitives
		undefined: (x) => {
			const un = x ? 1 : -1;
			return up ? un : -un;
		},
		boolean: (x, y) => (up ? +x - +y : +y - +x),
		number: (x, y) => (up ? x - y : y - x),
		bigint: (x, y) => {
			if (x === y) return 0;
			const vs = x < y ? 1 : -1;
			return up ? vs : -vs;
		},
		symbol: (x, y) => x.toString().localeCompare(y.toString()),
		string(x, y) {
			for (const [pattern, exp] of patterns) {
				const [type] = pattern.split(':') as [Categories];
				if (exp.test(x) && exp.test(y)) return this[type](x, y);
			}
			return up ? x.localeCompare(y) : y.localeCompare(x);
		},
		// object + null
		object(x, y) {
			if (x === null) return up ? -1 : 1;
			if (y === null) return up ? 1 : -1;
			return discriminator(x, y);
		},
		// wildcard *
		wildcard(x, y) {
			if (x == null) return up ? -1 : 1;
			if (y == null) return up ? 1 : -1;
			const [tx, ty] = [typeof x, typeof y];
			if (tx === 'function') return 0;

			if (tx !== ty) {
				const cx = JSON.stringify(x);
				const cy = JSON.stringify(y);
				return this.string(cx, cy);
			}

			const constrained: Wildcard = this[tx];
			return constrained(tx, ty);
		},
	};
}

export function comparator(order: 'asc' | 'dsc') {
	return (x: Record<string, any>, y: Record<string, any>): number => {
		const common = [...new Set([...Object.keys(x), ...Object.keys(y)])].filter(
			(k) => k in x && k in y && typeof x[k] === typeof y[k] && x[k] !== y[k]
		);
		for (
			let i = 0, key = common[i], data = typeof x[key];
			i < common.length && x[key] !== null && y[key] !== null;
			key = common[++i], data = typeof x[key]
		) {
			if (data === 'function') continue;
			if (data === 'object') return comparator(order)(x[key], y[key]);
			const constrained: Wildcard = compare(order)[data];
			if (data in compare) return constrained(x[key], y[key]);
		}
		return 0;
	};
}
