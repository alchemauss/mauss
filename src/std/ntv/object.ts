import type { IndexSignature } from '../../typings/aliases.js';
import type { Entries } from '../../typings/helpers.js';

export function entries<T extends object>(o: T) {
	return Object.entries(o) as Entries<T>;
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
