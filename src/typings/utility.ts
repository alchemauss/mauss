/**
 * Partially omits object properties
 *
 * Like 'Omit' but makes them optional properties instead
 *
 * Credits: webstrand#8856
 */
export type PartialOmit<
	T,
	K extends keyof T,
	U extends { [P in Exclude<keyof T, K>]: T[P] } & { [P in keyof T]?: T[P] } = {
		[P in Exclude<keyof T, K>]: T[P];
	} &
		{ [P in keyof T]?: T[P] }
> = { [P in keyof U]: U[P] };
