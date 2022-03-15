/* <-- Type Expanders: Prefixed with `Also` --> */

/** Expand T to also be an array */
export type AlsoArray<T> = T | T[];

/** Expand T to also be a promise */
export type AlsoPromise<T> = T | Promise<T>;
