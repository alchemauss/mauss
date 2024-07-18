# mauss

```js
import { :util } from 'mauss';
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

## `identical`

```ts
export function identical(x: unknown, y: unknown): boolean;
```

A function to check for values equality between two variables. This will work for any data type except `function`, which will always return true when two function are being compared. The heuristics are as follows:

-   fails immediately when the type of `x` and `y` are not the same
-   type of `function` are not comparable, always returns true
-   type of `symbol` is converted and compared as a `string`
-   primitive values are compared using strict equality operator
-   type of `object`, two empty array or object are considered the same
-   type of `object`, comparing array also considers its length and item order
-   type of `object`, two object must have the same keys before comparing its values
-   type of `object`, the order of key-value pair does not matter for equality check
-   `identical` is infinitely recursive for any amount of nested array/object

## `inverse`

A function that accepts a function and returns the same function with the order of parameters reversed. This can be used in conjunction with `compare` methods to sort the items in ascending values.

## `memory`

```typescript
export function memory<T>(initial: T, fn: (previous: T) => void): (updated: T) => T;
```

A higher-order function that runs a callback function only when the `initial`/previous and `updated` are different. This is useful for updating the state of a component only when the value has changed.

## `pipe`

A type-safe higher-order function that accepts any number of arguments, it returns a function with the parameters of the first function passed and a return type/value of the last function.

## `regexp`

A drop-in replacement for `new RegExp()` with special characters from source string escaped.

## `scope`

```ts
export function scope<T>(fn: () => T): T;
```

A convenience function to declare a variable with multiple conditionals to determine its final value, without cluttering the global or top-level scope with temporary variables that are only used once, and avoid nested ternary hell.

## `tsf`

A template string function. This takes a template string and returns a function that takes an object of functions, which is used to manipulate the name of the braces in the template string. Parameters of the braces can be prefixed with a question mark `?` to make it optional to the type system and will fallback to an empty string if it's not defined in the table.

<!-- , and a colon `:` to specify a default value. -->

This assumes the braces inside the template string are balanced and not nested. The function will not throw an error if the braces are not balanced, but the result will be unexpected. If you're using TypeScript and are passing a [string literal](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types), it will point out any unbalanced braces by throwing an error from the compiler.

```typescript
export function tsf(
	template: string,
): (table: {
	[key: string]: string | false | Nullish | ((key: string) => string | false | Nullish);
}) => string;
```

The template string is parsed into an array of strings, which are then executed with the provided table of functions, which is an object with the key being the name of the braces from the template string, and the value being the function to manipulate the name of the braces.

```javascript
import { tsf } from 'mauss/std';

const render = tsf('https://api.example.com/v1/{category}/{id}');

function publish({ category, id }) {
  const prefix = // ...
  const url = render({
    category: () => category !== 'new' && category,
    id: (v) => prefix + uuid(`${v}-${id}`),
  });

  return fetch(url);
}
```

## `unique`

```ts
export function unique<T, I>(array: T[], key?: string & I): T[];
```

A function that accepts an array and returns the same without any duplicate values. This can also handle an array of object by passing in a `key` as an identifier to access the object, with the same behaviour as [`compare.key`](#comparekey).
