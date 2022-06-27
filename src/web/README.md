# mauss/web

```js
import { :util } from 'mauss/web';
```

## `cookies`

Homemade baked cookies for server and client side usage.

## `qse`

```ts
type BoundValues = Nullish | Primitives;
export function qse<
  Bound extends { [k: string | number]: BoundValues | readonly BoundValues[] }
>(bound: Bound, transformer = (final: string) => final): string;
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
