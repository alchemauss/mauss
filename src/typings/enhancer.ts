export type JSONState<T> = { [P in keyof T]: T[P] extends { toJSON: () => infer J } ? J : T[P] };
export type Overwrite<A, B> = Omit<A, keyof B> & B;
export type Strict<T> = { [P in keyof T as {} extends Record<P, any> ? never : P]: T[P] };
export type Typify<T> = { [P in keyof T]: Typify<T[P]> };
