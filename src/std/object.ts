import type { Falsy, IndexSignature } from '../typings/aliases.js';
import type { AnyFunction, Entries, Freeze } from '../typings/helpers.js';
import type { Narrow } from '../typings/prototypes.js';

export function clone<T>(i: T): T {
	if (!i || typeof i !== 'object') return i;
	if (Array.isArray(i)) return i.map(clone) as T;
	const type = Object.prototype.toString.call(i);
	if (type !== '[object Object]') return i;
	return iterate(i) as T;
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
export function iterate<T extends object, I = T[keyof T]>(
	object: T,
	callback: AnyFunction<
		[entry: Entries<T>[number], index: number],
		void | Falsy | [IndexSignature, I]
	> = ([k, v]) => [k, clone(v) as I],
): I extends T[keyof T] ? T : unknown {
	const pairs = entries(object);
	const memo: typeof pairs = [];
	for (let i = 0; i < pairs.length; i++) {
		const res = callback(pairs[i], i);
		if (!res || res.length !== 2) continue;
		memo.push(res as (typeof memo)[number]);
	}
	return Object.fromEntries(memo) as any;
}

export function keys<T extends object>(o: T) {
	return Object.keys(o) as Array<string & keyof T>;
}

export function pick<Keys extends readonly string[]>(keys: Narrow<Keys>) {
	const props = new Set(keys);
	// @ts-expect-error - 100% TS bug not mine
	return <T extends object>(o: T): Pick<T, Keys[number]> => {
		// @ts-expect-error - unknown until `keys` are passed
		return iterate(o, ([k, v]) => props.has(k) && [k, v]);
	};
}

export function size<T extends object>(o: T): number {
	return Object.keys(o).length;
}
