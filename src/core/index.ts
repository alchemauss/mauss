import type { AnyFunction, Last, Reverse, UnaryFunction } from '../typings';

/**
 * inverse - reverses the order of provided arguments to fn parameters
 * @param fn any function with one or more arguments
 * @returns a curried function to take in the arguments
 */
export function inverse<T extends AnyFunction>(fn: T): AnyFunction<Reverse<Parameters<T>>> {
	return (...parameters) => fn(...parameters.reverse());
}

// TODO: validate the next parameter receive the same return type as the previous
export function pipe<Functions extends UnaryFunction[]>(...functions: Functions) {
	type InitialType = Parameters<Functions[0]>[0];
	type FinalType = ReturnType<Last<Functions, any>>;
	return (arg: InitialType): FinalType => {
		let pipeline = arg;
		for (let i = 0; i < functions.length; i++) {
			pipeline = functions[i](pipeline);
		}
		return pipeline;
	};
}

/**
 * unique - transform an array to a set and back to array
 * @param array items to be inspected
 * @returns duplicate-free version of the array input
 */
export function unique<T>(array: T[]): T[] {
	return [...new Set(array)];
}

/**
 * regexp - implementation of global RegExp constructor with escaped pattern
 * @param pattern passed in the form of string literal
 * @param flags unique set of characters from `d|g|i|m|s|u|y`
 * @returns dynamically constructed RegExp object
 */
export function regexp(pattern: string, flags?: string): RegExp {
	return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
}
