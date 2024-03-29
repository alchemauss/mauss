import type { Nullish, Primitives } from '../../typings/aliases.js';

type BoundValues = Nullish | Primitives;

/**
 * qse - query string encoder
 * @param bound object with key-value pair to be updated in the URL
 * @param transformer function that is applied to the final string if it exists
 * @returns final query string
 */
export default function qse<T extends object>(
	bound: T[keyof T] extends BoundValues | readonly BoundValues[] ? T : never,
	transformer = (final: string) => `?${final}`,
): string {
	const enc = encodeURIComponent;

	let final = '';
	for (let [k, v] of Object.entries(bound)) {
		if (v == null || (typeof v === 'string' && !(v = v.trim()))) continue;
		if ((k = enc(k)) && final) final += '&';

		if (Array.isArray(v)) {
			let pointer = 0;
			while (pointer < v.length) {
				if (pointer) final += '&';
				const item = v[pointer++];
				if (item == null) continue;
				final += `${k}=${enc(item)}`;
			}
			continue;
		}

		final += `${k}=${enc(v as Primitives)}`;
	}

	return final ? transformer(final) : final;
}
