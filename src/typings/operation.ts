/**
 * Joins a list of string with custom delimiter
 */
export type Join<StringList extends readonly string[], Delimiter extends string = '-'> =
	StringList extends readonly [infer Head, infer Next, ...infer Rest]
		? Join<
				[`${Head & string}${Delimiter}${Next & string}`, ...Extract<Rest, readonly string[]>],
				Delimiter
		  >
		: StringList extends readonly [infer OnlyItem]
		? OnlyItem
		: '';

/**
 * Generates a list of tuples from union
 */
export type Permutation<Union, Sliced = Union> = [Union] extends [never]
	? []
	: Union extends Union
	? [Union, ...Permutation<Sliced extends Union ? never : Sliced>]
	: never;

/**
 * Splits a string with custom separator
 */
export type Split<Key extends string, Separator extends string> =
	Key extends `${infer Prefix}${Separator}${infer Rest}`
		? [Prefix, ...Split<Rest, Separator>]
		: [Key];
