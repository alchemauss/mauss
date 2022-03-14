/* <-- Compact Type Helpers --> */

/** Generic for making any arbitrary function */
export type AnyFunction<P extends any[] = any[], R = any> = (...parameters: P) => R;
/** Allow either A or B but not both at the same time */
export type Either<A, B> = Only<A, B> | Only<B, A>;
export type Entries<T> = Array<{ [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]] }[keyof T]>;
export type Filter<T, Validator> = T extends Validator ? T : never;
/** Get the first item from an array, fallback defaults to `never` */
export type First<T extends any[], Fallback = never> = T extends [infer F, ...any[]] ? F : Fallback;
/** Allow autocompletion of union in addition to arbitrary values */
export type Flexible<Union extends T, T = string> = Union | (T & Record<never, never>);
/** Pick the properties of A that also exists in B */
export type Intersection<A, B> = Pick<A, Extract<keyof A, keyof B> & Extract<keyof B, keyof A>>;
/** Infers the return value of toJSON on the properties */
export type JSONState<T> = { [P in keyof T]: T[P] extends { toJSON: () => infer J } ? J : T[P] };
/** Get the last item from an array, fallback defaults to `never` */
export type Last<T extends any[], Fallback = never> = T extends [...any[], infer L] ? L : Fallback;
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
/** Any function that has exactly one parameter */
export type UnaryFunction<P = any, R = any> = (parameter: P) => R;
