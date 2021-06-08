interface Primitives extends Record<string, any> {
	boolean: (x: boolean, y: boolean) => number;
	bigint: (x: bigint, y: bigint) => number;
	number: (x: number, y: number) => number;
	string: (x: string, y: string) => number;
}
interface Patterns {
	date: (x: string, y: string) => number;
}

export const compare: Primitives & Patterns & Record<'format', Record<keyof Patterns, RegExp>> = {
	format: { date: /\d{1,4}-\d{1,2}-\d{1,4}/ },
	boolean: (x, y) => +y - +x,
	number: (x, y) => y - x,
	bigint: (x, y) => (x < y ? -1 : x > y ? 1 : 0),
	date: (x, y) => new Date(y).getTime() - new Date(x).getTime(),
	string(x, y) {
		for (const [type, exp] of Object.entries(this.format))
			if (exp.test(x) && exp.test(y)) return this[type](x, y);
		return x.localeCompare(y);
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
