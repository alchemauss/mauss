type EmptyString = '';
type Nullish = null | undefined;
type Falsy = 0 | false | EmptyString | Nullish;
type Primitives = string | number | bigint | boolean | symbol;

export const exists = <T>(i: T | EmptyString | Nullish): i is T => !nullish(i) && i !== '';
export const nullish = <T>(i: T | Primitives): i is T => i == null;
export const positive = <T>(i: T | Exclude<Falsy, 0>): i is T =>
	typeof i === 'number' ? i > 0 : exists(i);
export const truthy = <T>(i: T | EmptyString | Nullish | Falsy): i is T => !!i;
