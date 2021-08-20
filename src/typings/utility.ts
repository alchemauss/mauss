/**
 * Merge an object properties and make all of them optional.
 * But, when one of it is defined, all of it's other properties
 * needs to be defined as well.
 */
export type OptionalAnnex<T, Annex> = T extends {
	[K in keyof Annex]: { [Q in K]: Annex[Q] };
}[keyof Annex]
	? Annex & T
	: T;

/**
 * Partially omits object properties, like {@link Omit} but
 * makes them optional instead
 */
export type PartialOmit<
	T,
	Keys extends keyof T,
	Saved = { [K in Exclude<keyof T, Keys>]: T[K] },
	Optional = { [K in keyof T]?: T[K] },
	Final = Saved & Optional
> = { [K in keyof Final]: Final[K] };

/**
 * Single out a property from an object, receives object of
 * any properties and only allow one property to be defined
 */
export type SingleProperty<T> = {
	[K in keyof T]: { [I in K]: T[K] } & { [Q in Exclude<keyof T, K>]?: undefined };
}[keyof T];
