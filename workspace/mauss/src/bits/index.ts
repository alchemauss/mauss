import type { UnaryFunction } from '../typings/helpers.js';

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

export function lcs(...words: [string, string]) {
	// spread for unicode symbols
	const x = [...words[0]];
	const y = [...words[1]];

	const matrix = Array.from({ length: y.length + 1 }, () => Array(x.length + 1).fill(null));
	// provide initial values
	for (let col = 0; col <= x.length; col += 1) matrix[0][col] = 0;
	for (let row = 0; row <= y.length; row += 1) matrix[row][0] = 0;

	let length = 0;
	let colIdx = 0;
	let rowIdx = 0;
	for (let row = 1; row <= y.length; row += 1) {
		for (let col = 1; col <= x.length; col += 1) {
			if (x[col - 1] === y[row - 1]) {
				matrix[row][col] = matrix[row - 1][col - 1] + 1;
			} else {
				matrix[row][col] = 0;
			}

			if (matrix[row][col] > length) {
				length = matrix[row][col];
				rowIdx = row;
				colIdx = col;
			}
		}
	}

	if (length === 0) return '';

	let longest = '';
	while (matrix[rowIdx][colIdx] > 0) {
		longest = x[colIdx - 1] + longest;
		rowIdx -= 1;
		colIdx -= 1;
	}

	return longest;
}

export function minmax(array: number[]): [number, number] {
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
