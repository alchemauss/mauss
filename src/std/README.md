# mauss/std

Standard modules, augmented and refined.

```javascript
import { :util } from 'mauss/std';
```

## `csv`

CSV parser to read a valid string.

```typescript
export function read(content: string): string[][];
```

```javascript
import { readFileSync } from 'fs';
const file = readFileSync('./data.csv', 'utf-8');

csv.read(file);
```

## `ntv`

Native namespace for augmented static methods of standard objects.

### `ntv.clone`

Original function, creates a deep copy of any data type, use sparingly.

```typescript
export function clone<T>(i: T): T;
```

Creating a copy of a data type, especially an object, is useful for removing the reference to the original object, keeping it clean from unexpected changes and side effects. This is possible because we are creating a new instance, making sure that any mutation or changes that are applied won't affect one or the other.

### `ntv.freeze`

Augmented `Object.freeze()`, deep freezes and strongly-typed.

### `ntv.iterate`

Original function, iterate over the key-value pair of an object, returns a new object using the pairs returned from the callback function. If callback is omitted, the default behaviour will create a deep copy of the original object.

```typescript
export function iterate<T extends object>(
  object: T,
  callback: AnyFunction<
    [entry: Entries<T>[number], index: number],
    void | Falsy | [IndexSignature, any]
  > = ([k, v]) => [k, clone(v)]
): T;
```

The returned object will be filtered to only contain a key-value pair of the 2-tuple from `fn()`, any other values returned from the callback will be ignored, i.e. `void | Falsy`.

### `ntv.pick`

Original function, returns a curried function that constructs a new object consisting of the properties passed to `keys` as an array of strings.

```typescript
export function pick<K extends string[]>(keys: K): <T>(o: T) => Pick<T, K[number]>;
```

In the case of picking the same properties from multiple different objects, we can store it as `unwrap`

```typescript
const unwrap = pick(['a', 'b', 'c']);

unwrap({ ... });
```

### `ntv.size`

Convenience method to get the size of an object by checking the `length` of its keys.

### `ntv.zip`

Original function, aggregates elements from each of the arrays and returns a single array of objects with the length of the largest array.

```typescript
export function zip<T extends Array<Nullish | {}>>(...arrays: T[]): Record<IndexSignature, any>[];
```

## `tsf`

A template string function. This takes a template string and returns a function that takes an object of functions, which is used to manipulate the name of the braces in the template string. Parameters of the braces can be prefixed with a question mark `?` to make it optional to the type system and will fallback to an empty string if it's not defined in the table.

<!-- , and a colon `:` to specify a default value. -->

This assumes the braces inside the template string are balanced and not nested. The function will not throw an error if the braces are not balanced, but the result will be unexpected. If you're using TypeScript and are passing a [string literal](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types), it will point out any unbalanced braces by throwing an error from the compiler.

```typescript
export function tsf(
  template: string
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
