# mauss/guards

Collection of guard functions to pass TypeScript checks.

```js
import { :util } from 'mauss/guards';
```

## `exists`

A guard that returns `true` if the input is not nullish or an empty string.

## `nullish`

A guard that returns `true` if the input is `null` or `undefined`.

## `truthy`

A guard that returns `true` if the input is truthy in general.

## `natural`

A number guard that returns `true` if the input exists or is a number greater than 0.

## `whole`

A number guard that returns `true` if the input exists or is a number greater than or equal to 0.

## `not`

A utility guard that takes in any guards above and negates the result. For example,

- `not(exists)` will return `true` if the input is nullish or an empty string
- `not(natural)` will return `true` if the input exists or is a number less than or equal to 0.
