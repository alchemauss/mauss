import type { IndexSignature } from '../../typings/aliases.js';
import type { Entries } from '../../typings/helpers.js';

export function entries<T extends object>(o: T) {
	return Object.entries(o) as Entries<T>;
}

type DeepFreeze<T> = { readonly [P in keyof T]: DeepFreeze<T[P]> };
export function freeze<T extends object>(o: T): DeepFreeze<T> {
	for (const key of Object.getOwnPropertyNames(o)) {
		const value = o[key as keyof typeof o];
		if (value == null || typeof value !== 'object') continue;
		o[key as keyof typeof o] = freeze(value) as typeof value;
	}
	return Object.freeze(o);
}

/** Iterate over objects while retaining its structure */
export function iterate<T extends object>(
	o: T,
	fn: (entry: Entries<T>[number], index: number) => [IndexSignature, any]
) {
	const memo = entries(o).map(fn);
	return Object.fromEntries(memo);
}

export function keys<T extends object>(o: T) {
	return Object.keys(o) as Array<keyof T>;
}
