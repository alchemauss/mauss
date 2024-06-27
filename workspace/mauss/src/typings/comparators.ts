/* <-- Type Comparators: Prefixed with `When` --> */

/** When L extends R, returns `Y`, else `N` */
export type When<L, R, Y = true, N = never> = L extends R ? Y : N;

/** When T is type of `any`, returns `Y`, else `N` */
export type WhenAny<T, Y = true, N = false> = When<0, 1 & T, Y, N>;

/** When T is type of `Function`, returns `Y`, else `N` */
export type WhenFunction<T, Y = true, N = false> = When<T, Function, Y, N>;

/** When T is type of `never`, returns `Y`, else `N` */
export type WhenNever<T, Y = true, N = false> = When<[T], [never], Y, N>;

/** When T is type of `object`, returns `Y`, else `N` */
export type WhenObject<T, Y = true, N = false> = When<T, object, Y, N>;

/** When T is type of `unknown`, returns `Y`, else `N` */
export type WhenUnknown<T, Y = true, N = false> = When<unknown, T, Y, N>;
