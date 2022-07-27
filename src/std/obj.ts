import type { AnyFunction, Entries } from '../typings/helpers.js';

export const entries = <T>(o: T) => Object.entries(o) as Entries<T>;

// const data = { a: 'huh', b: 'what' };
// type E = Entries<typeof data>;
// const w = entries(data);
// w[0][0] === '';

//

export function queue(...functions: AnyFunction[]): void {
	functions.forEach((fn) => fn());
}
