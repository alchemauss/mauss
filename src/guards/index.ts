import type { Nullish, FullPrimitives as Primitives } from '../typings/aliases.js';

type EmptyString = '';
type Empty = EmptyString | Nullish;
type Falsy = 0 | false | EmptyString | Nullish;

/** @returns true if input is not `nullish` or an empty string */
export const exists = <T>(i: T | Empty): i is T => !nullish(i) && i !== '';
/** @returns true if input is `null` or `undefined` */
export const nullish = <T>(i: T | Primitives): i is T => i == null;
/** @returns true if input is truthy in general */
export const truthy = <T>(i: T | Falsy): i is T => !!i;

// number guards
/** @returns true if input exists or is a number greater than 0 */
export const natural = <T>(i: T | Empty): i is T => (typeof i === 'number' ? i > 0 : exists(i));
/** @returns true if input exists or is a number greater than or equal to 0 */
export const whole = <T>(i: T | Empty): i is T => (typeof i === 'number' ? i >= 0 : exists(i));

// currying utilities
/** @returns negation of the guard function passed, e.g. `not(nullish)` */
export function not<F extends typeof exists | typeof nullish | typeof truthy>(fn: F) {
	type D = F extends typeof exists ? Primitives : F extends typeof nullish ? Nullish : Empty;
	return <T>(i: T | D): i is T => !fn(i);
}
