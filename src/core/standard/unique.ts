import type { IndexSignature, Primitives } from '../../typings/aliases.js';
import type { Paths } from '../../typings/prototypes.js';

/**
 * unique - transform an array to a set and back to array
 * @param array items to be inspected
 * @returns duplicate-free version of the array input
 */

export default function unique<
	Inferred extends Record<IndexSignature, any>,
	Identifier extends Paths<Inferred>
>(array: readonly Inferred[], key: string & Identifier): Inferred[];
export default function unique<T extends Primitives>(array: readonly T[]): T[];
export default function unique<T, I>(array: readonly T[], key?: string & I): T[] {
	if (!key || typeof array[0] !== 'object') return [...new Set(array)];

	const filtered = Object.create(null);
	const trail = key.split('.');
	for (const item of array as Record<IndexSignature, any>[]) {
		const value: any = trail.reduce((r, p) => (r || {})[p], item);
		if (value && !(value in filtered)) filtered[value] = item;
	}
	return Object.values(filtered);
}
