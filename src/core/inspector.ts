import type { Filter, Split, WhenAny, WhenUnknown } from '../typings';

const patterns = {
	'date:complete': /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
	'date:time': /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/,
	date: /\d{4}-[01]\d-[0-3]\d/,
	time: /[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/,
};

type Wildcard = (x: any, y: any) => number;
type Primitives = {
	undefined(x: undefined, y: undefined): number;
	boolean(x: boolean, y: boolean): number;
	number(x: number, y: number): number;
	string(x: string, y: string): number;
	bigint(x: bigint, y: bigint): number;
	symbol(x: symbol, y: symbol): number;
	object(x: object, y: object): number;
};

type Customized = {
	key<Identifier extends string>(
		identifier: Identifier
	): <X extends Record<string, any>, Y extends Record<string, any>>(
		x: WhenAny<X[Identifier], never, WhenUnknown<X[Identifier], never, X>>,
		y: WhenAny<Y[Identifier], never, WhenUnknown<Y[Identifier], never, Y>>
	) => number;
};

type PatternKeys = keyof typeof patterns;
type Categories = Split<PatternKeys, ':'>[0];
type Prefixed<K extends string> = K extends `${infer P}:${string}` ? Filter<P, Categories> : K;
type Patterned = { [K in Prefixed<PatternKeys>]: (x: string, y: string) => number };
type Comparisons = Primitives & Customized & Patterned;
export const compare: Comparisons & { wildcard(x: any, y: any): number } = {
	// patterned
	date: (x, y) => new Date(y).getTime() - new Date(x).getTime(),
	time: (x, y) => Date.parse(`2017/08/28 ${y}`) - Date.parse(`2017/08/28 ${x}`),

	// customized
	key(k) {
		return (x, y) => this.object(x[k], y[k]);
	},

	// primitives
	undefined: (x) => (x ? -1 : 1),
	boolean: (x, y) => +y - +x,
	number: (x, y) => y - x,
	bigint: (x, y) => (x < y ? -1 : x > y ? 1 : 0),
	symbol: (x, y) => x.toString().localeCompare(y.toString()),
	string(x, y) {
		for (const [pattern, exp] of Object.entries(patterns)) {
			const [type] = pattern.split(':') as [Categories];
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
	// wildcard *
	wildcard(x, y) {
		if (x == null) return 1;
		if (y == null) return -1;
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
		const constrained: Wildcard = compare[data];
		if (data in compare) return constrained(x[key], y[key]);
	}
	return 0;
}
