# mauss/compare

A module for comparing variables with multiple functions for various types, including an `inspect` function that can sort any array of object (but only objects).

This module provides complete list of methods that covers all `typeof` values and some customized additions. All method returns a number that can be provided directly to `.sort` function, defaults to ordering in descending values.

| Method      | Accepts     |
| ----------- | ----------- |
| `undefined` | `undefined` |
| `boolean`   | `boolean`   |
| `number`    | `number`    |
| `string`    | `string`    |
| `bigint`    | `bigint`    |
| `symbol`    | `symbol`    |
| `object`    | `object`    |

```js
import * as compare from 'mauss/compare';

compare.string('abc', 'def');
// and other primitives

[
	/* data */
].sort(compare.number);
```

## `key`

```ts
type Wildcard = (x: any, y: any) => number;
export function key<Identifier extends string>(
	identifier: Identifier,
	comparator?: Wildcard,
): Wildcard;
```

A higher-order function that accepts a string as an identifier and an optional comparator function, it breaks up the identifier described by the dot (`.`) character and returns a curried function that accepts `(x, y)` with an object defined by the identifier.

```ts
const posts = [
	{ date: { month: 4 } },
	{ date: { month: 7 } },
	{ date: { month: 6 } },
	{ date: { month: 5 } },
	{ date: { month: 1 } },
	{ date: { month: 7 } },
	{ date: { month: 2 } },
];

posts.sort(compare.key('date.month'));
```

The optional comparator can be used when you have an existing custom sort function, e.g. in combination with `compare.order` to sort a set of string.

```ts
const posts = [
	{ date: { month: 'March' } },
	{ date: { month: 'June' } },
	{ date: { month: 'May' } },
	{ date: { month: 'April' } },
	{ date: { month: 'January' } },
	{ date: { month: 'June' } },
	{ date: { month: 'February' } },
];

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

posts.sort(compare.key('date.month', compare.order(months)));
```
