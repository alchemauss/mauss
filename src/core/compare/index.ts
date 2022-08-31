import type { WhenAny, WhenUnknown } from '../../typings/comparators.js';
import type { AnyFunction } from '../../typings/helpers.js';
import * as primitives from './primitives.js';

export * from './patterned.js';
export * from './primitives.js';

type Wildcard = AnyFunction<[x: any, y: any], number>;

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

	if (xt !== yt || xt === 'object' || yt === 'object') {
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
