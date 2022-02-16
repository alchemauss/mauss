/** Generic for making any arbitrary function */
export type AnyFunction<P extends any[] = any, R = any> = (...parameters: P) => R;
/** Exclude `undefined` from T */
export type Definable<T> = T extends undefined ? never : T;
/** Exclude all union that is in both A and B and get the difference */
export type Difference<A, B> = Exclude<A | B, A & B>;
/** Allow either A or B but not both at the same time */
export type Either<A, B> = Only<A, B> | Only<B, A>;
export type Entries<T> = Array<{ [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]] }[keyof T]>;
export type Filter<T, Validator> = T extends Validator ? T : never;
/** Allow autocompletion of union in addition to arbitrary values */
export type Flexible<Union extends T, T = string> = Union | (T & Record<never, never>);
/** Infers the return value of toJSON on the properties */
export type JSONState<T> = { [P in keyof T]: T[P] extends { toJSON: () => infer J } ? J : T[P] };
export type NonEmptyArray<T> = [T, ...Array<T>];
/** Disallow any properties from V when defining U */
export type Only<U, V> = { [P in keyof U]: U[P] } & Omit<{ [P in keyof V]?: never }, keyof U>;
export type Overwrite<U, V> = Omit<U, keyof V> & V;
export type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;
/** Reverses any tuple values */
export type Reverse<T extends any[]> = T extends [infer H, ...infer R] ? [...Reverse<R>, H] : [];
/** Strict properties narrowing and remove Index Signatures */
export type Strict<T> = { [P in keyof T as {} extends Record<P, any> ? never : P]: T[P] };
export type Typify<T> = { [P in keyof T]: Typify<T[P]> };

/* <-- Type Level Programming --> */

/** Convert Union to Intersection */
export type IntersectUnion<U> = (
	/** distributive conditional type */ U extends any ? (_: U) => void : never
) extends (_: /** conditional type inference */ infer Intersection) => void
	? Intersection
	: never;

/** Joins a list of string with custom delimiter */
export type Join<
	StringList extends readonly string[],
	Delimiter extends string = '-'
> = StringList extends readonly [infer Head, infer Next, ...infer Rest]
	? Join<
			[`${Head & string}${Delimiter}${Next & string}`, ...Extract<Rest, readonly string[]>],
			Delimiter
	  >
	: StringList extends readonly [infer OnlyItem]
	? OnlyItem
	: '';

/** Generates a list of tuples from union */
export type Permutation<Union, Sliced = Union> = [Union] extends [never]
	? []
	: Union extends Union
	? [Union, ...Permutation<Sliced extends Union ? never : Sliced>]
	: never;

/** Splits a string with custom separator */
export type Split<
	Key extends string,
	Separator extends string
> = Key extends `${infer Prefix}${Separator}${infer Rest}`
	? [Prefix, ...Split<Rest, Separator>]
	: [Key];

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
	Optional = { [P in keyof T]?: T[P] },
	Final = Saved & Optional
> = { [P in keyof Final]: Final[P] };

/**
 * Single out a property from an object, receives object of
 * any properties and only allow one property to be defined
 */
export type SingleProperty<T> = {
	[P in keyof T]: { [K in P]: T[P] } & { [K in Exclude<keyof T, P>]?: undefined };
}[keyof T];

/**
 * Specify tuple of `Size` with items of `T`
 */
export type Tuple<
	T,
	Size extends number,
	VirtualArray extends any[] = []
> = VirtualArray['length'] extends Size ? VirtualArray : Tuple<T, Size, [T, ...VirtualArray]>;
