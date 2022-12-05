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

### `ntv.clone`

Original function, creates a deep copy of any data type, use sparingly.

```ts
export function clone<T>(i: T): T;
```

Creating a copy of a data type, especially an object, is useful for removing the reference to the original object, keeping it clean from unexpected changes and side effects. This is possible because we are creating a new instance, making sure that any mutation or changes that are applied won't affect one or the other.

### `ntv.freeze`

Augmented `Object.freeze()`, deep freezes and strongly-typed.

### `ntv.iterate`

Original function, iterate over the key-value pair of an object, returns a new object using the pairs returned from the callback function. If callback is omitted, the default behaviour will create a deep copy of the original object.

```ts
export function iterate<T extends object>(
	object: T,
	callback: AnyFunction<
		[entry: Entries<T>[number], index: number],
		void | Falsy | [IndexSignature, any]
	> = ([k, v]) => [k, clone(v)]
): T;
```

The returned object will be filtered to only contain a key-value pair of the 2-tuple from `fn()`, any other values returned from the callback will be ignored, i.e. `void | Falsy`.
