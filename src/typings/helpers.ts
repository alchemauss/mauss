/* <-- Compact Type Helpers --> */

/** Generic for making any arbitrary function */
export type AnyFunction<P extends any[] = any[], R = any> = (...parameters: P) => R;

/** Exclude `undefined` from T */
export type Definable<T> = T extends undefined ? never : T;

/** Exclude all union that is in both A and B and get the difference */
export type Difference<A, B> = Exclude<A | B, A & B>;

/** Allow either A or B but not both at the same time */
export type Either<A, B> = Only<A, B> | Only<B, A>;

/** Strongly-type array of tuple from object in `Object.entries` */
export type Entries<T> = {
	[K in keyof T]-?: [NonNullable<keyof PickByValue<T, T[K]>>, T[K]];
}[keyof T][];

// for `Narrow` in /typings/prototypes.ts
export type Fallback<A, B> = A extends B ? A : B;

/** Remove type from T that does not satisfy type of Validator */
export type Filter<T, Validator> = T extends Validator ? T : never;

/** Get the first item from an array, fallback defaults to `never` */
export type First<T extends any[], Fallback = never> = T extends [infer F, ...any[]] ? F : Fallback;

/** Allow autocompletion of union in addition to arbitrary values */
export type Flexible<Union extends T, T = string> = Union | (T & Record<never, never>);

/** Recursively make all properties of object T as readonly */
export type Freeze<T> = { readonly [P in keyof T]: T[P] extends Function ? T[P] : Freeze<T[P]> };

/** Pick the properties of A that also exists in B */
export type Intersection<A, B> = Pick<A, Extract<keyof A, keyof B> & Extract<keyof B, keyof A>>;

/** Infers the return value of toJSON on the properties */
export type JSONState<T> = { [P in keyof T]: T[P] extends { toJSON: () => infer J } ? J : T[P] };

/** Get the last item from an array, fallback defaults to `never` */
export type Last<T extends any[], Fallback = never> = T extends [...any[], infer L] ? L : Fallback;

/** Defines a type with at least one item */
export type NonEmptyArray<T> = [T, ...T[]];

/** Disallow any properties from B when defining A */
export type Only<A, B> = { [P in keyof A]: A[P] } & Omit<{ [P in keyof B]?: never }, keyof A>;

/** Overwrite properties in A with values from B */
export type Overwrite<A, B> = Omit<A, keyof B> & B;

/** Pick the properties of T that satisfies type of V */
export type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;

/** Reverses any tuple values */
export type Reverse<T extends any[]> = T extends [infer H, ...infer R] ? [...Reverse<R>, H] : [];

/** Strict properties narrowing and remove Index Signatures */
export type Strict<T> = { [P in keyof T as {} extends Record<P, any> ? never : P]: T[P] };

/** Workaround for a type not fulfilling index signature constraint */
export type Typify<T> = { [P in keyof T]: Typify<T[P]> };

/** Any function that has exactly one parameter */
export type UnaryFunction<P = any, R = any> = (parameter: P) => R;
