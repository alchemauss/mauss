# mauss/web

```js
import { :util } from 'mauss/web';
```

## `cookies`

Homemade baked cookies for server and client side usage.

## `clipboard`

This namespace extends the [`Navigator` object](https://developer.mozilla.org/en-US/docs/Web/API/Navigator), make sure to execute the functions in environments where `window.navigator` exists.

```ts
export function copy(
  data: string | ClipboardItem,
  handler: {
    accept?(): Promise<void>;
    reject?(): Promise<void>;
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

```ts
type BoundValues = Nullish | Primitives;
export function qse<
  Bound extends { [k: string | number]: BoundValues | readonly BoundValues[] }
>(bound: Bound, transformer = (final: string) => `?${final}`): string;
```

Query string encoder (`qse`) encodes key-value pairs from an object into a query string. It optionally accepts a second argument for a transformer function that will be applied to the final value if it exists, else an empty string will be returned.

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
