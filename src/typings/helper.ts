export type Overwrite<A, B> = Omit<A, keyof B> & B;
export type JSONState<T> = { [P in keyof T]: T[P] extends { toJSON: () => infer J } ? J : T[P] };
