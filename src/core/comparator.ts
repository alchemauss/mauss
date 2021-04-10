export const compare: Record<string, any> & {
	format: { [type: string]: RegExp };
	date: (x: string, y: string) => number;
	string: (x: string, y: string) => number;
} = {
	format: { date: /\d{1,4}-\d{1,2}-\d{1,4}/ },
	date: (x, y) => new Date(y).getTime() - new Date(x).getTime(),
	string(x, y) {
		for (const [type, exp] of Object.entries(this.format)) {
			if (exp.test(x) && exp.test(y)) return this[type](x, y);
		}
		return x.localeCompare(y);
	},
};

export function comparator(x: Record<string, any>, y: Record<string, any>): number {
	const common = [...new Set([...Object.keys(x), ...Object.keys(y)])].filter(
		(k) => k in x && k in y && typeof x[k] === typeof y[k] && x[k] !== y[k]
	);
	for (let i = 0, key = common[i]; i < common.length; key = common[++i]) {
		if (x[key] === null && y[key] === null) continue;
		if (typeof x[key] === 'string') return compare.string(x[key], y[key]);
		if (typeof x[key] === 'object') return comparator(x[key], y[key]);
	}
	return 0;
}
