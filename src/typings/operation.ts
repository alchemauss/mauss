export type Join<StringList extends readonly string[], Delimiter extends string = '-'> =
	StringList extends readonly [infer Head, infer Next, ...infer Rest]
		? Join<
				[`${Head & string}${Delimiter}${Next & string}`, ...Extract<Rest, readonly string[]>],
				Delimiter
		  >
		: StringList extends readonly [infer OnlyItem]
		? OnlyItem
		: '';

export type Permutation<L, Z = L> = [L] extends [never]
	? []
	: L extends L
	? [L, ...Permutation<Z extends L ? never : Z>]
	: never;
