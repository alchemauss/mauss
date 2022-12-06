import type { Falsy, IndexSignature } from '../../typings/aliases.js';
import type { AnyFunction, Entries, Freeze } from '../../typings/helpers.js';

export function clone<T>(i: T): T {
	if (!i || typeof i !== 'object') return i;
	if (Array.isArray(i)) return i.map(clone) as T;
	const type = Object.prototype.toString.call(i);
	if (type === '[object Object]') return iterate(i);
	return i;
}

export function entries<T extends object>(o: T) {
	return Object.entries(o) as Entries<T>;
}

export function freeze<T extends object>(o: T): Freeze<T> {
	for (const key of Object.getOwnPropertyNames(o)) {
		const value = o[key as keyof typeof o];
		if (value == null || typeof value !== 'object') continue;
		o[key as keyof typeof o] = freeze(value) as typeof value;
	}
	return Object.freeze(o);
}

/**
 * Iterate over the key-value pair of an object, returns a new object using the pairs returned from the callback function. If callback is omitted, the default behaviour will create a deep copy of the original object.
 */
export function iterate<T extends object>(
	object: T,
	callback: AnyFunction<
		[entry: Entries<T>[number], index: number],
		void | Falsy | [IndexSignature, any]
	> = ([k, v]) => [k, clone(v)]
) {
	const pairs = entries(object);
	const memo: typeof pairs = [];
	for (let i = 0; i < pairs.length; i++) {
		const res = callback(pairs[i], i);
		if (!res || res.length !== 2) continue;
		memo.push(res as typeof memo[number]);
	}
	return Object.fromEntries(memo) as T;
}

export function keys<T extends object>(o: T) {
	return Object.keys(o) as Array<keyof T>;
}
