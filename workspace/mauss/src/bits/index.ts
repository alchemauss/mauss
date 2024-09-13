import type { UnaryFunction } from '../typings/helpers.js';

/**
 * Binary search algorithm on a sorted array
 * @returns the first item that passes the check
 */
export function binary<T>(
	sorted: T[],
	check: {
		item: UnaryFunction<T, false | UnaryFunction<T>>;
		pointer: UnaryFunction<T, boolean>;
	},
): T | undefined {
	let start = 0, final = sorted.length - 1; // prettier-ignore
	while (start <= final) {
		const midpoint = (start + final) >> 1;
		const current = sorted[midpoint];
		const passes = check.item(current);
		if (passes) return passes(current);
		const flag = check.pointer(current);
		start = flag ? start : midpoint + 1;
		final = flag ? midpoint - 1 : final;
	}
	return;
}

export function lcs(a: string, b: string) {
	const [x, y] = [[...a], [...b]]; // spread for unicode symbols
	const matrix = Array.from({ length: y.length + 1 }, () => Array(x.length + 1).fill(0));

	let length = 0;
	let col = 0;
	let row = 0;
	for (let yi = 1; yi <= y.length; yi += 1) {
		for (let xi = 1; xi <= x.length; xi += 1) {
			matrix[yi][xi] = x[xi - 1] === y[yi - 1] ? matrix[yi - 1][xi - 1] + 1 : 0;
			if (matrix[yi][xi] > length) {
				length = matrix[yi][xi];
				row = yi;
				col = xi;
			}
		}
	}

	if (length === 0) return '';

	let longest = '';
	while (matrix[row][col] > 0) {
		longest = x[col - 1] + longest;
		row -= 1;
		col -= 1;
	}

	return longest;
}

/**
 * Find the minimum and maximum values in an array of numbers
 */
export function minmax(array: number[]): [min: number, max: number] {
	if (!array.length) return [0, 0];

	let min = array[0], max = array[0]; // prettier-ignore
	for (let i = 1; i < array.length; i++) {
		min = array[i] < min ? array[i] : min;
		max = array[i] > max ? array[i] : max;
	}
	return [min, max];
}

export function power(base: number, exponent: number): number {
	if (exponent === 0) return 1;
	const mul = power(base, Math.floor(exponent / 2));
	return mul * mul * (exponent % 2 ? base : 1);
}
