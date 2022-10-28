export function entries<T extends object>(o: T) {
	type Returned = import('../../typings/index.js').Entries<T>;
	return Object.entries(o) as Returned;
}

export function keys<T extends object>(o: T) {
	return Object.keys(o) as Array<keyof T>;
}
