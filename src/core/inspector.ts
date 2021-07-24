import type { Split } from '../typings/operation';

type Primitives = {
	boolean: (x: boolean, y: boolean) => number;
	number: (x: number, y: number) => number;
	string: (x: string, y: string) => number;
	bigint: (x: bigint, y: bigint) => number;
	symbol: (x: symbol, y: symbol) => number;
	object: (x: object, y: object) => number;
};
type Patterns = {
	'date:complete': (x: string, y: string) => number;
	'date:time': (x: string, y: string) => number;
	date: (x: string, y: string) => number;
};
const patterns: Array<[keyof Patterns, RegExp]> = [
	['date:complete', /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/],
	['date:time', /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/],
	['date', /\d{4}-[01]\d-[0-3]\d/],
];

type PatternGroups = Pick<Patterns, Split<keyof Patterns, ':'>[0]>;
type Comparisons = Primitives & PatternGroups;
export const compare: Comparisons = {
	date: (x, y) => new Date(y).getTime() - new Date(x).getTime(),
	// primitives
	boolean: (x, y) => +y - +x,
	number: (x, y) => y - x,
	bigint: (x, y) => (x < y ? -1 : x > y ? 1 : 0),
	symbol(x, y) {
		return this.string(x.toString(), y.toString());
	},
	string(x, y) {
		for (const [pattern, exp] of patterns) {
			const [type] = pattern.split(':') as [keyof PatternGroups];
			if (exp.test(x) && exp.test(y)) return this[type](x, y);
		}
		return x.localeCompare(y);
	},
	// object + null
	object(x, y) {
		if (x === null) return 1;
		if (y === null) return -1;
		return comparator(x, y);
	},
};

export function comparator(x: Record<string, any>, y: Record<string, any>): number {
	const common = [...new Set([...Object.keys(x), ...Object.keys(y)])].filter(
		(k) => k in x && k in y && typeof x[k] === typeof y[k] && x[k] !== y[k]
	);
	for (
		let i = 0, key = common[i], data = typeof x[key];
		i < common.length && x[key] !== null && y[key] !== null;
		key = common[++i], data = typeof x[key]
	) {
		if (data === 'object') return comparator(x[key], y[key]);
		if (data in compare) return compare[data](x[key], y[key]);
	}
	return 0;
}
