import type { Nullish, Primitives } from '../../typings';

type BoundValues = Nullish | Primitives;
type Bound = { [k: string | number]: BoundValues | readonly BoundValues[] };

/**
 * qse - query string encoder
 * @param bound object with key-value pair to be updated in the URL
 * @returns final query string
 */
export default function qse<T extends Bound>(bound: T): string {
	const enc = encodeURIComponent;

	let final = '';
	for (let [k, v] of Object.entries(bound)) {
		if (typeof v !== 'string') {
			if (v == null) continue;
			v = v.toString();
		}
		if (!(v = v.trim())) continue;
		if (final) final += '&';
		final += `${enc(k)}=${enc(v)}`;
	}

	return final;
}
