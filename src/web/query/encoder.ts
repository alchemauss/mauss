import type { Primitives } from '../../typings';

/**
 * qse - query string encoder
 * @param bound object with key-value pair to be updated in the URL
 * @returns final query string
 */
export default function qse(bound: { [K in string | number]?: Primitives }): string {
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
