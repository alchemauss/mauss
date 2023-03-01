# mauss

```js
import { :util } from 'mauss';
```

## `compare`

A namespace with multiple functions for various types, including an `inspect` function that can sort any array of object (but only objects).

This namespace provides complete list of methods that covers all `typeof` values and some customized additions. All method returns a number that can be provided directly to `.sort` function, defaults to ordering in descending values.

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

### `compare.key`

```ts
type Wildcard = (x: any, y: any) => number;
export function key<
  Identifier extends string
>(identifier: Identifier, comparator?: Wildcard): Wildcard;
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

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

posts.sort(
  compare.key('date.month', compare.order(months))
);
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

## `execute`

```ts
export function execute(
  condition: truthy,
  correct: () => AlsoPromise<void> | AnyFunction<[]>,
  otherwise: () => AlsoPromise<void> | AnyFunction<[]> = () => {}
): void;
```

A convenience function to avoid writing [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)s. Instead of having `(...)()` everywhere in the codebase, it will be much nicer to see

```ts
execute(you === world, () => {
  // ...
})
```

Combined with Svelte's `$:`, which is a way to mark statements as reactive, we can have `async` operations that reacts to changes in the application and `await` them as well.

```svelte
<script>
  export let initial;
  import { execute } from 'mauss';

  let editable = initial;
  $: execute(editable !== initial, async () => {
    // imagine `editable` as the local state and `initial` from an API...
    // inside here will only run when `editable` and `initial` are different
    // (or whatever boolean condition you put as the first argument)
    // this means it will also not run on initial component mount.

    // e.g. if `editable` is changed, we'll trigger a request to update the DB.
    //
    // we can then use SvelteKit's `invalidate[All]` function to update
    // `initial` and refresh the whole app's page data without having to
    // update the variables manually and individually.
    //
    // when using SvelteKit, the current page/component will not be recreated
    // but because `editable` is declared with `let`, it will not change when
    // `initial` is updated, preventing an infinite loop.
  })
</script>
```

## `identical`

```ts
export function identical(x: unknown, y: unknown): boolean;
```

A function to check for values equality between two variables. This will work for any data type except `function`, which will always return true when two function are being compared. The heuristics are as follows:

- fails immediately when the type of `x` and `y` are not the same
- type of `function` are not comparable, always returns true
- type of `symbol` is converted and compared as a `string`
- primitive values are compared using strict equality operator
- type of `object`, two empty array or object are considered the same
- type of `object`, comparing array also considers its length and item order
- type of `object`, two object must have the same keys before comparing its values
- type of `object`, the order of key-value pair does not matter for equality check
- `identical` is infinitely recursive for any amount of nested array/object

## `inverse`

A function that accepts a function and returns the same function with the order of parameters reversed. This can be used in conjunction with `compare` methods to sort the items in ascending values.

## `memory`

```typescript
export function memory<T>(initial: T, fn: (previous: T) => void): (updated: T) => T;
```

A higher-order function that runs a callback function only when the `initial`/previous and `updated` are different.

## `pipe`

A type-safe higher-order function that accepts any number of arguments, it returns a function with the parameters of the first function passed and a return type/value of the last function.

## `regexp`

A drop-in replacement for `new RegExp()` with special characters from source string escaped.

## `scope`

```ts
export function scope<T>(fn: () => T): T;
```

A convenience function to declare a variable with multiple conditionals to determine its final value, without cluttering the global or top-level scope with temporary variables that are only used once, and avoid nested ternary hell.

## `unique`

```ts
export default function unique<T, I>(array: T[], key?: string & I): T[];
```

A function that accepts an array and returns the same without any duplicate values. This can also handle an array of object by passing in a `key` as an identifier to access the object, with the same behaviour as [`compare.key`](#comparekey).
