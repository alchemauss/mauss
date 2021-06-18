/**
 * Merge an object properties and make all of them optional.
 * But, when one of it is defined, all of it's other properties
 * needs to be defined as well.
 */
export type OptionalAnnex<T, Annex> = T extends {
	[P in keyof Annex]: { [Q in P]: Annex[Q] };
}[keyof Annex]
	? Annex & T
	: T;

/**
 * Partially omits object properties, like {@link Omit} but
 * makes them optional instead
 */
export type PartialOmit<
	T,
	K extends keyof T,
	U extends { [P in Exclude<keyof T, K>]: T[P] } & { [P in keyof T]?: T[P] } = {
		[P in Exclude<keyof T, K>]: T[P];
	} &
		{ [P in keyof T]?: T[P] }
> = { [P in keyof U]: U[P] };

/**
 * Single out a property from an object, receives object of
 * any properties and only allow one property to be defined
 */
export type SingleProperty<T> = {
	[P in keyof T]: { [I in P]: T[P] } & { [Q in Exclude<keyof T, P>]?: undefined };
}[keyof T];
