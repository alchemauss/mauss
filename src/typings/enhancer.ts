import type { PickByValue } from './helper';

export type Entries<T> = Array<{ [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]] }[keyof T]>;
export type Typify<T> = { [K in keyof T]: Typify<T[K]> };
