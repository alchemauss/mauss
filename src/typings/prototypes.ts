/* <-- Type Level Programming --> */

import type { IndexSignature, Narrowable } from './aliases.js';
import type { When } from './comparators.js';
import type { Fallback } from './helpers.js';

export type Concat<Left, Right, Delimiter = '.'> = When<
	[Left, Right],
	[string, string],
	`${Left & string}${'' extends Right ? '' : Delimiter & string}${Right & string}`
>;

/** Extends a list to a certain specified length */
export type Extend<Size extends number, List extends any[] = []> = List['length'] extends Size
	? List
	: Extend<Size, [...List, any]>;

/** Flattens any array recursively */
export type Flatten<List extends any[], Memory extends any[] = []> = List extends []
	? /** return Memory if List is empty */ Memory
	: List extends [infer Head, ...infer Rest]
	? Head extends any[] // check for nested array
		? Flatten<[...Head, ...Rest], Memory>
		: Flatten<Rest, [...Memory, Head]>
	: never;

/** Convert Union to Intersection */
export type IntersectUnion<U> = /** distributive conditional type */ (
	U extends any ? (_: U) => void : never
) extends (_: /** conditional type inference */ infer Intersection) => void
	? Intersection
	: never;

/** Joins a list of string with custom delimiter */
export type Join<
	StringList extends readonly string[],
	Delimiter extends string = '-',
> = StringList extends readonly [infer Head, infer Next, ...infer Rest]
	? Join<
			[`${Head & string}${Delimiter}${Next & string}`, ...Extract<Rest, readonly string[]>],
			Delimiter
	  >
	: StringList extends readonly [infer OnlyItem]
	? OnlyItem
	: '';

// TODO remove once `const` modifier lands in TS 5.0
// https://github.com/microsoft/TypeScript/pull/51865
export type Narrow<T> = Fallback<
	T,
	[] | (T extends Narrowable ? T : never) | { [K in keyof T]: Narrow<T[K]> }
>;

/**
 * Merge an object properties and make all of them optional.
 * But, when one of it is defined, all of it's other properties
 * needs to be defined as well.
 */
export type OptionalAnnex<T, Annex> = T extends {
	[P in keyof Annex]: { [K in P]: Annex[K] };
}[keyof Annex]
	? Annex & T
	: T;

/**
 * Partially omits object properties, like {@link Omit} but
 * makes them optional instead
 */
export type PartialOmit<
	T,
	Keys extends keyof T,
	Saved = { [P in Exclude<keyof T, Keys>]: T[P] },
	Final = Saved & { [P in keyof T]?: T[P] },
> = { [P in keyof Final]: Final[P] };

/**
 * Generates all possible properties of nested object,
 * starting from the root and ends anywhere in the tree.
 * @returns string union with dot (.) as the delimiter
 */
export type Paths<T> = T extends object
	? When<T, Date, '', { [K in keyof T]-?: `${K & string}` | Concat<K, Paths<T[K]>> }[keyof T]>
	: '';

/** Generates a list of tuples from union */
export type Permutation<Union, Sliced = Union> = [Union] extends [never]
	? []
	: Union extends Union
	? [Union, ...Permutation<Sliced extends Union ? never : Sliced>]
	: never;

/** Define a union of tuple that accepts a progressively increasing (LTR) items */
export type Progressive<List extends any[]> = List extends [...infer Rest, any]
	? List | (Rest['length'] extends 1 ? Rest : Progressive<Rest>)
	: List;

/**
 * Single out a property from an object, receives object of
 * any properties and only allow one property to be defined
 */
export type SingleProperty<T> = {
	[P in keyof T]: { [K in P]: T[P] } & { [K in Exclude<keyof T, P>]?: undefined };
}[keyof T];

/** Slices a list beginning from the starting index */
export type Slice<List extends any[], Start extends number = 0> = List extends [
	...Extend<Start>,
	...infer Sliced,
]
	? Sliced
	: [];

/** Splits a string with custom separator */
export type Split<
	Key extends IndexSignature,
	Separator extends string,
> = Key extends `${infer Prefix}${Separator}${infer Rest}`
	? [Prefix, ...Split<Rest, Separator>]
	: [Key];

/**
 * Specify tuple of `Size` with items of `T`
 */
export type Tuple<
	Size extends number,
	T extends any[] = [],
	Virtual extends any[] = [],
> = Virtual['length'] extends Size ? Virtual : Tuple<Size, T, [T, ...Virtual]>;
