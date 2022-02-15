import type { Primitives } from '../typings';
import * as cookies from './cookies';

export { cookies };

/**
 * qpm - query string pathname maker
 * @param bound object with key-value pair to be updated in the URL
 * @param prefix string to prepend on the final output
 * @returns final query string
 */
export function qpm(bound: Record<string, Exclude<Primitives, symbol>>, prefix = ''): string {
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

	return prefix + final;
}
