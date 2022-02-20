import type { AnyFunction } from '../../typings';

// TODO: specify return type with Curried<F>
export default function curry<F extends AnyFunction>(fn: F, expected = fn.length) {
	// TODO: only allow a set amount of argument combinations
	return <Arguments extends Parameters<F>>(...args: Arguments) => {
		if (args.length >= expected) return fn(...args);
		return curry((...next) => fn(...[...args, ...next]), expected - args.length);
	};
}
