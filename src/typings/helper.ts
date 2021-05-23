export type Overwrite<T, K> = Omit<T, keyof K> & K;
