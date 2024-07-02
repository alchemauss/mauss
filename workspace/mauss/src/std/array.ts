import type { IndexSignature, Nullish } from '../typings/aliases.js';

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
