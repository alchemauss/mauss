export { permutation } from './set/index.js';

export function clamp(min: number, max: number) {
	return (value: number) => Math.max(min, Math.min(value, max));
}

/**
 * The `%` is a remainder operator, this function computes the modulo operation and ensures a non-negative number. The result is always in the range `[0, n)`.
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
