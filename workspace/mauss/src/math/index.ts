export { permutation } from './set/index.js';

/** A higher-order function that returns a function to clamp a number between a minimum and maximum value */
export function clamp(min: number, max: number) {
	return (value: number) => Math.max(min, Math.min(value, max));
}
