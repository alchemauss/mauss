type EmptyString = '';
type Nullish = null | undefined;
type Falsy = 0 | false | EmptyString | Nullish;
type Primitives = string | number | bigint | boolean | symbol;

export const exists = <T>(i: T | EmptyString | Nullish): i is T => !nullish(i) && i !== '';
export const nullish = <T>(i: T | Primitives): i is T => i == null;
export const truthy = <T>(i: T | EmptyString | Nullish | Falsy): i is T => !!i;

// number guards
/** @returns true if input exists or is a number greater than 0 */
export const natural = <T>(i: T | Falsy): i is T => (typeof i === 'number' ? i > 0 : exists(i));
/** @returns true if input exists or is a number greater than or equal to 0 */
export const whole = <T>(i: T | Falsy): i is T => (typeof i === 'number' ? i >= 0 : exists(i));
