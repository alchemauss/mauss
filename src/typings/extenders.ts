/* <-- Type Expanders: Prefixed with `Also` --> */

/** Expand T to also be an array */
export type AlsoArray<T> = T | T[];

/** Expand T to also be a promise */
export type AlsoPromise<T> = T | Promise<T>;

/** Expand T to an array and the readonly version */
export type ArrayConstant<T> = T[] | readonly T[];
