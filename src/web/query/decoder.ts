import type { PotArray, Primitives } from '../../typings';
import { tryNumber } from '../../utils';

type QueryDecoder<Query extends string> = Query extends `${infer Leading}${infer Rest}`
	? Leading extends '?'
		? QueryDecoder<Rest>
		: `${Leading}${Rest}` extends `${infer Param}&${infer Next}`
		? QueryDecoder<Param> & QueryDecoder<Next>
		: `${Leading}${Rest}` extends `${infer Key}=${infer Value}`
		? Record<Key, Value>
		: {}
	: {};

/**
 * qsd - query string decoder
 * @param qs query string of a URL with or without the leading `?`
 * @returns mapped object of decoded query string
 */
export function qsd<Q extends string>(qs: Q) {
	if (qs[0] === '?') qs = qs.slice(1) as Q;
	if (!qs) return {} as QueryDecoder<Q>;

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
	return dqs as QueryDecoder<Q>;
}
