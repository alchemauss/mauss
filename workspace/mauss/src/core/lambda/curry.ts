import type { AnyFunction } from '../../typings/helpers.js';
import type { Progressive, Slice } from '../../typings/prototypes.js';

type Currying<Fun extends AnyFunction> = <Arguments extends Progressive<Parameters<Fun>>>(
	...args: Arguments
) => Arguments['length'] extends Parameters<Fun>['length']
	? ReturnType<Fun>
	: Currying<(...args: Slice<Parameters<Fun>, Arguments['length']>) => ReturnType<Fun>>;

export default function curry<F extends AnyFunction>(fn: F, expected = fn.length): Currying<F> {
	return <Arguments extends Progressive<Parameters<F>>>(...args: Arguments) => {
		if (args.length === expected) return fn(...args);
		if (args.length > expected) return fn(...args.slice(0, expected));
		return curry((...next) => fn(...[...args, ...next]), expected - args.length);
	};
}
