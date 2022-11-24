# mauss/std

Standard modules, augmented and refined.

```js
import { :util } from 'mauss/std';
```

## `csv`

CSV parser to read a valid string.

```ts
export function read(content: string): string[][];
```

```js
import { readFileSync } from 'fs';
const file = readFileSync('./data.csv', 'utf-8');

csv.read(file);
```

## `ntv`

Native namespace for augmented static methods of standard objects.

### `ntv.freeze`

Augmented `Object.freeze()`, deep freezes and strongly-typed.

### `ntv.iterate`

Original function, loop over and return an object.

```ts
export function iterate<T extends object>(
  object: T,
  fn: (entry: Entries<T>[number], index: number) => void | Falsy | [IndexSignature, any]
): { [k: string]: T[keyof T] };
```

The returned object will be filtered to only contain a key-value pair of the 2-tuple from `fn()`, any other values returned from the callback will be ignored.
