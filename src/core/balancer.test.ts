import { UnaryFunction } from '../typings';
import { debounce, throttle } from './balancer';

declare function expect<T>(v: T): void;

const str = (_: string) => {};
const num = (_: number) => {};
const name = (_: { name: string }) => {};

expect<UnaryFunction<string>>(debounce(str));
expect<UnaryFunction<number>>(debounce(num));
expect<UnaryFunction<{ name: string }>>(debounce(name));

// @ts-expect-error
expect<UnaryFunction<number>>(debounce(str));
// @ts-expect-error
expect<UnaryFunction<string>>(debounce(num));
// @ts-expect-error
expect<UnaryFunction<{ name: boolean }>>(debounce(name));
