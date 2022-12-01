# mauss/web

```js
import { :util } from 'mauss/web';
```

## `cookies`

Homemade baked cookies for server and client side usage.

## `clipboard`

This namespace extends the [`Navigator` object](https://developer.mozilla.org/en-US/docs/Web/API/Navigator), make sure to execute the function in environments where `window.navigator` exists.

```ts
export function copy(
  data: string | ClipboardItem,
  handler: {
    accept?(): void | Promise<void>;
    reject?(): void | Promise<void>;
  } = {}
): void;

export function item(
  type: string,
  data: string | Blob,
  options?: ClipboardItemOptions
): ClipboardItem;

export function paste(type: 'blob'): Promise<ClipboardItems>;
export function paste(type: 'text'): Promise<string>;
export function paste(type: 'blob' | 'text');
```

## `qse`

Query string encoder (`qse`) encodes key-value pairs from an object into a query string. It optionally accepts a second argument for a transformer function that will be applied to the final value if it exists, else an empty string will be returned.

```ts
type BoundValues = Nullish | Primitives;
export function qse<T extends object>(
	bound: T[keyof T] extends BoundValues | readonly BoundValues[] ? T : never,
	transformer = (final: string) => `?${final}`
): string
```

The first parameter `bound` only accepts an object with nullish and primitive literals or an array of those values.

Transformer function is useful in cases where we want to add a leading `?` when the query string exists but not when it's empty, or when we would like to append another existing query string after only if the output of `qse` exists.

```js
// https://mauss.dev/reviews

let query = 'anything'; // a reactive variable
const type = 1;

const updated = qse({ q: query, type });
history.replaceState({}, '', updated);
// https://mauss.dev/reviews?q=anything&type=1
```

With SvelteKit in `<script>` tag:

```js
import { browser } from '$app/env';
import { goto } from '$app/navigation';
$: shareable = qse({ q: query });
$: browser && goto(shareable, { replaceState: true });
```
