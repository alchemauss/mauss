export const isExists = <T>(item: T | false | null | undefined): item is T =>
	item !== false && item !== null && item !== undefined;
