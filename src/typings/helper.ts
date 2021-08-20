export type Overwrite<A, B> = Omit<A, keyof B> & B;
