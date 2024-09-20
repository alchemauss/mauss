import type { AnyFunction, Last, UnaryFunction } from '../../typings/helpers.js';
import type { Progressive, Slice } from '../../typings/prototypes.js';

type Currying<Fun extends AnyFunction> = <Arguments extends Progressive<Parameters<Fun>>>(
	...args: Arguments
) => Arguments['length'] extends Parameters<Fun>['length']
	? ReturnType<Fun>
	: Currying<(...args: Slice<Parameters<Fun>, Arguments['length']>) => ReturnType<Fun>>;

/**
 * A type-safe higher-order function that accepts a function with one or more parameters and returns a function that can take in one or more arguments with a max of the parameters length.
 * If the total arguments provided has not yet reached the initial function parameters length, it will return a function until all the required parameters are fulfilled.
 *
 * @returns a curried function to take in the arguments
 */
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

/**
 * A type-safe higher-order function that accepts any number of arguments, it returns a function with the parameters of the first function passed and a return type/value of the last function.
 *
 * @returns a function that takes in the initial type and returns the final type
 */
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

function error(msg?: string) {
	const error = msg || '';
	return { kind: 'error' as const, error };
}
function success<T>(value: T) {
	return { kind: 'success' as const, value };
}

type Result<T> = ReturnType<typeof error> | ReturnType<typeof success<T>>;

function cast<X, Y extends X>(fn: (x: X) => x is Y) {
	return (arg: X): Result<Y> => {
		try {
			return fn(arg) ? success(arg) : error();
		} catch {
			return error();
		}
	};
}

export const mask = {
	of<T>(fn: () => T): Result<T> {
		try {
			return success(fn());
		} catch {
			return error();
		}
	},

	async resolve<T>(p: Promise<T>): Promise<Result<T>> {
		return p.then((v) => success(v)).catch(() => error());
	},

	wrap: cast(<T>(i: T | undefined | null): i is T => i != null),
} as const;

export function reveal<T>(opt: Result<T>) {
	return {
		expect(message: string) {
			if (opt.kind === 'success') return opt.value;
			throw new Error(message);
		},
		or(fallback: T): T {
			return opt.kind === 'success' ? opt.value : fallback;
		},
	};
}
