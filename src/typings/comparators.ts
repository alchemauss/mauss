/* <-- Type Comparators: Prefixed with `When` --> */

/** When T is type of `any`, returns `Y`, else `N` */
export type WhenAny<T, Y = true, N = false> = 0 extends 1 & T ? Y : N;
/** When T is type of `unknown`, returns `Y`, else `N` */
export type WhenUnknown<T, Y = true, N = false> = unknown extends T ? Y : N;
