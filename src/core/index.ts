import type { AnyFunction, Reverse } from '../typings/helpers.js';

/**
 * inverse - reverses the order of provided arguments to fn parameters
 * @param fn any function with one or more arguments
 * @returns a curried function to take in the arguments
 */
export function inverse<Function extends AnyFunction>(fn: Function) {
	type Reversed = Reverse<Parameters<Function>>;
	type Returned = ReturnType<Function>;
	return (...parameters: Reversed): Returned => fn(...parameters.reverse());
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
