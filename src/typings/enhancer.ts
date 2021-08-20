export type Typify<T> = { [P in keyof T]: Typify<T[P]> };
