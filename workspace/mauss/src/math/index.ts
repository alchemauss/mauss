export { permutation } from './set/index.js';

/**
 * Calculates the mean from a list of numbers using an incremental approach (moving average algorithm), which uses a constant space and updates in constant time. This method helps avoid potential numerical instability issues when dealing with a large sum, such as an integer overflow.
 *
 * @example
 * ```javascript
 * // returns 3
 * average([1, 2, 3, 4, 5]);
 * ```
 */
export function average(numbers: number[]): number {
	let mean = 0;
	for (let i = 0; i < numbers.length; i++) {
		mean += (numbers[i] - mean) / (i + 1);
	}
	return mean;
}

/** A higher-order function that returns a function to clamp a number between a minimum and maximum value */
export function clamp(min: number, max: number) {
	return (value: number) => Math.max(min, Math.min(value, max));
}

/**
 * The `%` is a remainder operator, this function computes the modulo operation and ensures a non-negative number for a non-negative divisor.
 *
 * @example
 * ```javascript
 * // returns 1
 * modulo(5, 2);
 *
 * // returns 1
 * modulo(-3, 2);
 * ```
 */
export function modulo(a: number, n: number): number {
	return ((a % n) + n) % n;
}
