import type { AlsoArray, Flatten, Intersection, Primitives } from '../../typings';
import { tryNumber } from '../../utils';

type CombineExisting<
	A extends Record<any, any>,
	B extends Record<any, any>,
	Duplicate = Intersection<A, B>
> = Omit<A, keyof Duplicate> &
	Omit<B, keyof Duplicate> & {
		[P in keyof Duplicate]: Flatten<[A[P], B[P]]>;
	};

type QueryDecoder<Query extends string> = string extends Query
	? Record<string, string | string[]>
	: Query extends `${infer Leading}${infer Rest}`
	? Leading extends '?'
		? QueryDecoder<Rest>
		: `${Leading}${Rest}` extends `${infer Param}&${infer Next}`
		? CombineExisting<QueryDecoder<Param>, QueryDecoder<Next>>
		: `${Leading}${Rest}` extends `${infer Key}=${infer Value}`
		? { [K in Key]: Value }
		: {}
	: {};

/**
 * qsd - query string decoder
 * @param qs query string of a URL with or without the leading `?`
 * @returns mapped object of decoded query string
 */
export default function qsd<Q extends string>(qs: Q) {
	if (qs[0] === '?') qs = qs.slice(1) as Q;
	if (!qs) return {} as QueryDecoder<Q>;

	const dec = (s: string) => {
		if (!s.trim()) return '';
		s = decodeURIComponent(s);
		return ['true', 'false'].includes(s) ? s[0] === 't' : tryNumber(s);
	};

	const dqs: Record<any, AlsoArray<Primitives>> = {};
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
