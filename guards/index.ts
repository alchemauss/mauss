export const isExists = <T>(item: T | 0 | '' | false | null | undefined | typeof NaN): item is T =>
	!!item;
