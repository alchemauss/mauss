import type { IndexSignature, Nullish, Primitives } from '../../typings/aliases.js';
import type { AlsoArray } from '../../typings/extenders.js';
import type { Intersection } from '../../typings/helpers.js';
import type { Flatten } from '../../typings/prototypes.js';

type CombineExisting<
	A extends Record<IndexSignature, any>,
	B extends Record<IndexSignature, any>,
	Duplicate = Intersection<A, B>,
> = Omit<A, keyof Duplicate> &
	Omit<B, keyof Duplicate> & {
		[P in keyof Duplicate]: Flatten<[A[P], B[P]]>;
	};

type QueryDecoder<Query extends string> = string extends Query
	? Record<IndexSignature, string | readonly string[]>
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
 * Query string decoder (`qsd`) decodes a query string into an object. It accepts a query string with or without the leading `?` and returns a mapped object of decoded query string
 *
 * @param qs query string of a URL with or without the leading `?`
 * @returns mapped object of decoded query string
 */
export function qsd<Q extends string>(qs: Q) {
	if (qs[0] === '?') qs = qs.slice(1) as Q;
	if (!qs) return {} as QueryDecoder<Q>;

	const dec = (s: string) => {
		if (!s.trim()) return '';
		s = decodeURIComponent(s);
		if (['true', 'false'].includes(s)) return s[0] === 't';
		return Number.isNaN(Number(s)) ? s : Number(s);
	};

	const dqs: Record<IndexSignature, AlsoArray<Primitives>> = {};
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

type BoundValues = Nullish | Primitives;

/**
 * Query string encoder (`qse`) encodes key-value pairs from an object into a query string. It optionally accepts a second argument for a transformer function that will be applied to the final value if it exists, else an empty string will be returned
 *
 * @param bound  object with key-value pair to be updated in the URL, only accepts an object with nullish and primitive literals or an array of those values
 * @param transformer function that is applied to the final string if it exists, useful in cases where we want to add a leading `?` when the query exists but not when it's empty, or when we would like to append another existing query string after only if the output of `qse` exists
 * @returns final query string
 */
export function qse<T extends object>(
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
