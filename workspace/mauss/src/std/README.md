# mauss/std

Standard modules, augmented and refined.

```javascript
import { :util } from 'mauss/std';
```

## `augment`

Augments the source object with various utility methods, such as

- `build(keys: string[])` - creates a new object with the keys passed
- `readonly entries` - returns an array of the object entries
- `filter(keys: string[])` - returns the object with only the keys passed
- `freeze()` - deep freezes the object
- `readonly keys` - returns an array of the object keys
- `readonly size` - returns the size of the object

## `clone`

Original function, creates a deep copy of any data type, use sparingly.

```typescript
export function clone<T>(i: T): T;
```

Creating a copy of a data type, especially an object, is useful for removing the reference to the original object, keeping it clean from unexpected changes and side effects. This is possible because we are creating a new instance, making sure that any mutation or changes that are applied won't affect one or the other.

## `iterate`

Original function, iterate over the key-value pair of an object, returns a new object using the pairs returned from the callback function. If callback is omitted, the default behavior will create a deep copy of the original object.

```typescript
export function iterate<T extends object>(
	object: T,
	callback: AnyFunction<
		[entry: Entries<T>[number], index: number],
		void | Falsy | [IndexSignature, any]
	> = ([k, v]) => [k, clone(v)],
): T;
```

The returned object will be filtered to only contain a key-value pair of the 2-tuple from `fn()`, any other values returned from the callback will be ignored, i.e. `void | Falsy`.

## `zip`

Original function, aggregates elements from each of the arrays and returns a single array of objects with the length of the largest array.

```typescript
export function zip<T extends Array<Nullish | {}>>(...arrays: T[]): Record<IndexSignature, any>[];
```
