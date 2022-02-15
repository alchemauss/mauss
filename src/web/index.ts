import type { Primitives, PotArray } from '../typings';
import { tryNumber } from '../utils';

export * as cookies from './cookies';

/**
 * qse - query string encoder
 * @param bound object with key-value pair to be updated in the URL
 * @returns final query string
 */
export function qse(bound: Record<string, Primitives>): string {
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

/**
 * qsd - query string decoder
 * @param qs query string of a URL with or without the leading `?`
 * @returns mapped object of decoded query string
 */
export function qsd(qs: string) {
	if (qs[0] === '?') qs = qs.slice(1).trim();
	if (!qs) return {};

	const dec = (s: string) => {
		if (!s.trim()) return '';
		s = decodeURIComponent(s);
		return ['true', 'false'].includes(s) ? s[0] === 't' : tryNumber(s);
	};

	const dqs: Record<string, PotArray<Primitives>> = {};
	const qar = qs.split('&');
	for (let i = 0; i < qar.length; i++) {
		const [k, v] = qar[i].split('=');
		const item = dqs[k]; // satisfy TS
		if (!dqs[k] && (dqs[k] = dec(v))) continue;
		if (!Array.isArray(item)) dqs[k] = [item];
		(dqs[k] as Primitives[]).push(dec(v));
	}
	return dqs;
}
