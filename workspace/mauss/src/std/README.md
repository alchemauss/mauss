# mauss/std

Standard modules, augmented and refined.

```javascript
import { :util } from 'mauss/std';
```

## `clone`

Original function, creates a deep copy of any data type, use sparingly.

```typescript
export function clone<T>(i: T): T;
```

Creating a copy of a data type, especially an object, is useful for removing the reference to the original object, keeping it clean from unexpected changes and side effects. This is possible because we are creating a new instance, making sure that any mutation or changes that are applied won't affect one or the other.

## `freeze`

Augmented `Object.freeze()`, deep freezes and strongly-typed.

## `iterate`

Original function, iterate over the key-value pair of an object, returns a new object using the pairs returned from the callback function. If callback is omitted, the default behaviour will create a deep copy of the original object.

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

## `pick`

Original function, returns a curried function that constructs a new object consisting of the properties passed to `keys` as an array of strings.

```typescript
export function pick<K extends string[]>(keys: K): <T>(o: T) => Pick<T, K[number]>;
```

In the case of picking the same properties from multiple different objects, we can store it as `unwrap`

```typescript
const unwrap = pick(['a', 'b', 'c']);

unwrap({ ... });
```

## `size`

Convenience method to get the size of an object by checking the `length` of its keys.

## `zip`

Original function, aggregates elements from each of the arrays and returns a single array of objects with the length of the largest array.

```typescript
export function zip<T extends Array<Nullish | {}>>(...arrays: T[]): Record<IndexSignature, any>[];
```
