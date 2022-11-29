import type { Falsy, IndexSignature } from '../../typings/aliases.js';
import type { AnyFunction, Entries, Freeze } from '../../typings/helpers.js';

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
	> = ([k, v]) => [k, v && typeof v === 'object' ? iterate(v) : v]
) {
	const pairs = entries(object);
	const memo: typeof pairs = [];
	for (let i = 0; i < pairs.length; i++) {
		const res = callback(pairs[i], i);
		if (!res || res.length !== 2) continue;
		memo.push(res as typeof memo[number]);
	}
	return Object.fromEntries(memo);
}

export function keys<T extends object>(o: T) {
	return Object.keys(o) as Array<keyof T>;
}
