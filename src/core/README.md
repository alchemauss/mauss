# mauss

```js
import { :util } from 'mauss';
```

## `compare/comparator`

compare utility object with multiple methods for various types, and comparator function that can sort any array of object (but only objects).

### `compare`

Compare object provides a complete list of methods that covers all `typeof` values and some customized additions. All method returns a number that can be provided directly to `.sort` function, defaults to ordering in descending values.

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
compare.string('abc', 'def');
// and other primitives

[/* data */].sort(comparator);
```

## `curry`

A type-safe higher-order function that accepts a function with one or more parameters and returns a function that can take in one or more arguments with a max of the parameters length.

If the total arguments provided has not yet reached the initial function parameters length, it will return a function until all the required parameters are fulfilled.

## `debounce/throttle`

```js
function search(name) {...}

const dSearch = debounce(search, 500);
const tSearch = throttle(search, 500);

dSearch('mauss'); // execute after 500ms
tSearch('mauss'); // execute every 500ms
```

## `inverse`

A function that accepts a function and returns the same function with the order of parameters reversed. This can be used in conjunction with `compare` methods to sort the items in ascending values.

## `pipe`

A type-safe higher-order function that accepts any number of arguments, it returns a function with the parameters of the first function passed and a return type/value of the last function.

## `regexp`

A drop-in replacement for `new RegExp()` with special characters from source string escaped.

## `unique`

A function that accepts an array and returns an array with no duplicate values.
