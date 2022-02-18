import type { PotArray, Primitives } from '../../typings';
import { tryNumber } from '../../utils';

/**
 * qsd - query string decoder
 * @param qs query string of a URL with or without the leading `?`
 * @returns mapped object of decoded query string
 */
export default function qsd(qs: string) {
	if (qs[0] === '?') qs = qs.slice(1).trim();
	if (!qs) return {};

	const dec = (s: string) => {
		if (!s.trim()) return '';
		s = decodeURIComponent(s);
		return ['true', 'false'].includes(s) ? s[0] === 't' : tryNumber(s);
	};

	const dqs: Record<any, PotArray<Primitives>> = {};
	const qar = qs.split('&');
	for (let i = 0; i < qar.length; i++) {
		const [k, v] = qar[i].split('=');
		if (v === undefined) continue;
		const item = dqs[k]; // satisfy TS
		if (!dqs[k] && (dqs[k] = dec(v))) continue;
		if (!Array.isArray(item)) dqs[k] = [item];
		(dqs[k] as Primitives[]).push(dec(v));
	}
	return dqs;
}
