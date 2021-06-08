export type Join<T extends readonly string[], D extends string = '-'> = T extends readonly [
	infer H,
	infer H2,
	...infer R
]
	? Join<[`${H & string}${D}${H2 & string}`, ...Extract<R, readonly string[]>], D>
	: T extends readonly [infer H]
	? H
	: '';

export type Permutation<L, Z = L> = [L] extends [never]
	? []
	: L extends L
	? [L, ...Permutation<Z extends L ? never : Z>]
	: never;
