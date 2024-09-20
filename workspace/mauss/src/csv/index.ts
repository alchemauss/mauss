/**
 * Parse a CSV content into a 2D array.
 *
 * @example
 * ```javascript
 * import { readFileSync } from 'fs';
 * import { read } from 'mauss/csv';
 * const csv = read(readFileSync('./data.csv', 'utf-8'));
 * ```
 *
 * @returns a 2D array of the CSV content
 */
export function read(content: string) {
	let current = [''];
	let parsing = true;

	let col = 0;
	let memo = '';

	const accumulator = [current];
	for (let char of content) {
		if (char === '"') {
			if (parsing && char === memo) current[col] += char;
			parsing = !parsing;
		} else if (parsing && char === ',') {
			current[++col] = char = '';
		} else if (parsing && char === '\n') {
			if (memo === '\r') current[col] = current[col].slice(0, -1);
			accumulator[accumulator.length] = current = [(char = '')];
			col = 0;
		} else {
			current[col] += char;
		}
		memo = char;
	}

	return accumulator;
}
