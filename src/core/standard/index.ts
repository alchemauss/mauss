import type { AlsoPromise } from '../../typings/extenders.js';
import type { AnyFunction, Reverse } from '../../typings/helpers.js';

interface CapitalizeOptions {
	/** only capitalize the very first letter */
	cap?: boolean;
	/** convert the remaining word to lowercase */
	normalize?: boolean;
}
export function capitalize(text: string, { cap, normalize }: CapitalizeOptions = {}): string {
	if (normalize) text = text.toLowerCase();
	if (cap) return `${text[0].toUpperCase()}${text.slice(1)}`;
	return text.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

export function execute(
	condition: boolean,
	correct: () => AlsoPromise<void> | AnyFunction<[]>,
	otherwise: () => AlsoPromise<void> | AnyFunction<[]> = () => {},
) {
	condition ? correct() : otherwise();
}

/** identical - checks whether x and y have the same values */
export function identical(x: unknown, y: unknown): boolean {
	const [xt, yt] = [typeof x, typeof y];
	if (xt !== yt) return false;
	if (xt === 'function') return true;
	if (xt === 'symbol') {
		// @ts-expect-error - guaranteed symbol
		return x.toString() === y.toString();
	}

	if (xt !== 'object') return x === y;
	if (x == null || y == null) return x === y;

	if (Array.isArray(x) !== Array.isArray(y)) return false;
	if (Array.isArray(x) && Array.isArray(y)) {
		if (x.length !== y.length) return false;
		for (let i = 0; i < x.length; i++) {
			if (!identical(x[i], y[i])) return false;
		}
		return true;
	}

	const [xk, yk] = [Object.keys(x), Object.keys(y)];
	const keys = new Set([...xk, ...yk]);
	if (xk.length !== yk.length || keys.size !== xk.length) return false;
	for (const k of keys) {
		// @ts-expect-error - guaranteed indexable
		if (!identical(x[k], y[k])) return false;
	}
	return true;
}

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
 * outdent - removes the indentation based on the first line's indentation
 * @param text input text to have its indentation cleaned up
 * @returns text without any indentation from the first line
 */
export function outdent(text: string) {
	const lines = text.split(/\r?\n/).filter((l) => l.trim());
	const indent = (/^\s*/.exec(lines[0]) || [''])[0].length;
	return lines.map((l) => l.slice(indent)).join('\n');
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

export function scope<T>(fn: () => T) {
	return fn();
}
