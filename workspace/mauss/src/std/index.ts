import type { Falsy, IndexSignature, Nullish } from '../typings/aliases.js';
import type { AnyFunction, Entries, Freeze } from '../typings/helpers.js';
import type { Narrow } from '../typings/prototypes.js';

export function augment<O extends object>(object: O) {
	const o = clone(object);

	return {
		build<Keys extends readonly string[]>(keys: Narrow<Keys>) {
			return [...keys].reduce(
				// @ts-expect-error - unknown until `keys` are passed
				(a, k) => ({ ...a, [k]: k in o ? o[k] : null }),
				{} as { [K in Keys[number]]: K extends keyof O ? O[K] : null },
			);
		},

		get entries() {
			return Object.entries(o) as Entries<O>;
		},

		filter<Keys extends readonly string[]>(
			keys: Narrow<Keys>,
		): // @ts-expect-error - 100% TS bug not mine
		Pick<O, Keys[number]> {
			const props = new Set(keys);
			// @ts-expect-error - unknown until `keys` are passed
			return iterate(o, ([k, v]) => props.has(k) && [k, v]);
		},

		freeze(): Freeze<O> {
			for (const key of Object.getOwnPropertyNames(o)) {
				const value = o[key as keyof typeof o];
				if (value == null || typeof value !== 'object') continue;
				o[key as keyof typeof o] = augment(value).freeze() as typeof value;
			}
			return Object.freeze(o);
		},

		get keys() {
			return Object.keys(o) as Array<string & keyof O>;
		},

		get size() {
			return this.keys.length;
		},
	};
}

export function clone<T>(i: T): T {
	if (!i || typeof i !== 'object') return i;
	if (Array.isArray(i)) return i.map(clone) as T;
	const type = Object.prototype.toString.call(i);
	if (type !== '[object Object]') return i;
	return iterate(i) as T;
}

/**
 * Iterate over the key-value pair of an object, returns a new object using the pairs returned from the callback function. If callback is omitted, the default behavior will create a deep copy of the original object.
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
