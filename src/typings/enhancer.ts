import type { PickByValue } from './helper';

export type Entries<T> = Array<{ [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]] }[keyof T]>;
export type Filter<T, Validator> = T extends Validator ? T : never;
export type Overwrite<A, B> = Omit<A, keyof B> & B;
export type Strict<T> = { [P in keyof T as {} extends Record<P, any> ? never : P]: T[P] };
export type Typify<T> = { [P in keyof T]: Typify<T[P]> };
