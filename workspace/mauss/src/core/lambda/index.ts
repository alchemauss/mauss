import type { AnyFunction, Last, UnaryFunction } from '../../typings/helpers.js';
import type { Progressive, Slice } from '../../typings/prototypes.js';

type Currying<Fun extends AnyFunction> = <Arguments extends Progressive<Parameters<Fun>>>(
	...args: Arguments
) => Arguments['length'] extends Parameters<Fun>['length']
	? ReturnType<Fun>
	: Currying<(...args: Slice<Parameters<Fun>, Arguments['length']>) => ReturnType<Fun>>;

export function curry<F extends AnyFunction>(fn: F, expected = fn.length): Currying<F> {
	return <Arguments extends Progressive<Parameters<F>>>(...args: Arguments) => {
		if (args.length === expected) return fn(...args);
		if (args.length > expected) return fn(...args.slice(0, expected));
		return curry((...next) => fn(...[...args, ...next]), expected - args.length);
	};
}

type Validator<
	Functions extends UnaryFunction[],
	Computed extends UnaryFunction = (v: ReturnType<Functions[0]>) => ReturnType<Functions[1]>,
> = Functions extends [infer Resolved, infer _, ...infer Rest]
	? Rest extends UnaryFunction[]
		? [Resolved, ...Validator<[Computed, ...Rest]>]
		: never // will never reach here, condition always satisfies
	: Functions;

export function pipe<F extends UnaryFunction[]>(...functions: Validator<F>) {
	type InitialType = Parameters<F[0]>[0];
	type FinalType = ReturnType<Last<F, any>>;
	return (arg: InitialType): FinalType => {
		let pipeline = arg;
		for (let i = 0; i < functions.length; i++) {
			pipeline = functions[i](pipeline);
		}
		return pipeline;
	};
}
