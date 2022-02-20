import type { AnyFunction } from '../../typings';

export default function curry<F extends AnyFunction>(fn: F, expected = fn.length) {
	return <Arguments extends Parameters<F>>(...args: Arguments) => {
		if (args.length >= expected) return fn(...args);
		return curry((...next: any[]) => fn(...[...args, ...next]), expected - args.length);
	};
}
