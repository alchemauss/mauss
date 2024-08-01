export { permutation } from './set/index.js';

export function clamp(min: number, max: number) {
	return (value: number) => Math.max(min, Math.min(value, max));
}
