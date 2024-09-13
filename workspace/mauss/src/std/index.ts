import type { Falsy, IndexSignature, Nullish } from '../typings/aliases.js';
import type { AnyFunction, Entries, Freeze } from '../typings/helpers.js';
import type { Narrow } from '../typings/prototypes.js';

/** Augments the source object with various utility methods */
export function augment<O extends object>(object: O) {
	const o = clone(object);

	return {
		/** @returns a new object with all the keys passed */
		build<Keys extends readonly string[]>(keys: Narrow<Keys>) {
			return [...keys].reduce(
				// @ts-expect-error - unknown until `keys` are passed
				(a, k) => ({ ...a, [k]: k in o ? o[k] : null }),
				{} as { [K in Keys[number]]: K extends keyof O ? O[K] : null },
			);
		},

		/** @returns an array of strongly-typed object entries */
		get entries() {
			return Object.entries(o) as Entries<O>;
		},

		/** @returns a new object with only the keys passed */
		filter<Keys extends readonly string[]>(
			keys: Narrow<Keys>,
		): // @ts-expect-error - 100% TS bug not mine
		Pick<O, Keys[number]> {
			const props = new Set(keys);
			// @ts-expect-error - unknown until `keys` are passed
			return iterate(o, ([k, v]) => props.has(k) && [k, v]);
		},

		/** Deep freezes the current object */
		freeze(): Freeze<O> {
			for (const key of Object.getOwnPropertyNames(o)) {
				const value = o[key as keyof typeof o];
				if (value == null || typeof value !== 'object') continue;
				o[key as keyof typeof o] = augment(value).freeze() as typeof value;
			}
			return Object.freeze(o);
		},

		/** @returns an array of strongly-typed object keys */
		get keys() {
			return Object.keys(o) as Array<string & keyof O>;
		},

		/** @returns the total number of properties in the object */
		get size() {
			return this.keys.length;
		},
	};
}

/**
 * Creating a copy of a data type, especially an object, is useful for removing the reference to the original object, keeping it clean from unexpected changes and side effects. This is possible because we are creating a new instance, making sure that any mutation or changes that are applied won't affect one or the other
 * @returns a deep copy of the object input
 */
export function clone<T>(i: T): T {
	if (!i || typeof i !== 'object') return i;
	if (Array.isArray(i)) return i.map(clone) as T;
	const type = Object.prototype.toString.call(i);
	if (type !== '[object Object]') return i;
	return iterate(i) as T;
}

/**
 * Iterate over the key-value pair of an object, returns a new object using the pairs returned from the callback function. If callback is omitted, the default behavior will create a deep copy of the original object
 *
 * The returned object will be filtered to only contain a key-value pair of the 2-tuple from `fn()`, any other values returned from the callback will be ignored, i.e. `void | Falsy`
 */
export function iterate<T extends object, I = T[keyof T]>(
	object: T,
	callback: AnyFunction<
		[entry: Entries<T>[number], index: number],
		void | Falsy | [IndexSignature, I]
	> = ([k, v]) => [k, clone(v) as I],
): I extends T[keyof T] ? T : unknown {
	const pairs = Object.entries(object) as Entries<T>;
	const memo: typeof pairs = [];
	for (let i = 0; i < pairs.length; i++) {
		const res = callback(pairs[i], i);
		if (!res || res.length !== 2) continue;
		memo.push(res as (typeof memo)[number]);
	}
	return Object.fromEntries(memo) as any;
}

/** Aggregates elements from each of the arrays and returns a single array of objects with the length of the largest array */
export function zip<T extends Array<Nullish | {}>>(...arrays: T[]) {
	const max = Math.max(...arrays.map((a) => a.length));
	const items: T[number][] = [];
	for (let idx = 0, empty; idx < max; idx++, empty = !0) {
		const zipped: T[number] = {};
		for (const prime of arrays) {
			if (!prime[idx]) continue;
			empty = !Object.assign(zipped, prime[idx]);
		}
		if (!empty) items.push(zipped);
	}
	return items as Record<IndexSignature, any>[];
}
