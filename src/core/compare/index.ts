import type * as TS from '../../typings/index.js';
import * as primitives from './primitives.js';

export * from './patterned.js';
export * from './primitives.js';

type Wildcard = TS.AnyFunction<[x: any, y: any], number>;

export function object(x: object, y: object): number {
	if (x === null) return 1;
	if (y === null) return -1;
	return inspect(x, y);
}

export function wildcard(x: any, y: any): number {
	if (x == null) return 1;
	if (y == null) return -1;
	const [xt, yt] = [typeof x, typeof y];
	if (xt === 'function') return 0;

	if (xt !== yt || xt === 'object') {
		const xs = JSON.stringify(x);
		const ys = JSON.stringify(y);
		return primitives.string(xs, ys);
	}

	const constrained: Wildcard = primitives[xt];
	return constrained(x, y);
}

export function inspect(x: Record<any, any>, y: Record<any, any>): number {
	const common = [...new Set([...Object.keys(x), ...Object.keys(y)])].filter(
		(k) => k in x && k in y && typeof x[k] === typeof y[k] && x[k] !== y[k]
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

// ---- customized ----

export function key<
	Inferred extends Record<TS.IndexSignature, any>,
	Identifier extends keyof Inferred = TS.Paths<Inferred>
>(identifier: string & Identifier, comparator?: Wildcard) {
	type BuildValidator<Keys, Expected> = Keys extends [infer I extends string, ...infer R]
		? Expected & Record<I, BuildValidator<R, I extends keyof Expected ? Expected[I] : never>>
		: Expected;

	const trail = identifier.split('.');
	const drill = (o: Inferred) => trail.reduce((ret, prop) => ret[prop], o);

	type Properties = TS.Split<Identifier, '.'>;
	return <X extends Inferred, Y extends Inferred>(
		x: TS.WhenAny<keyof X, X, BuildValidator<Properties, X>>,
		y: TS.WhenAny<keyof Y, Y, BuildValidator<Properties, Y>>
	) => (comparator || wildcard)(drill(x as Inferred), drill(y as Inferred));
}

export function order(weights: string[]): Wildcard {
	const m: Record<string, number> = {};
	weights.forEach((v, i) => (m[v] = i));
	return (x, y) => m[x] - m[y];
}
