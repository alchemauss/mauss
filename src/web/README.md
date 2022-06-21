# mauss/web

```js
import { :util } from 'mauss/web';
```

## `cookies`

Homemade baked cookies for server and client side usage.

## `qse`

```js
// https://mauss.dev/reviews

let query = 'anything'; // a reactive variable
const type = 1;

const updated = qse({ q: query, type });
history.replaceState({}, '', `?${updated}`);
// https://mauss.dev/reviews?q=anything&type=1
```

With SvelteKit in `<script>` tag:

```js
import { browser } from '$app/env';
import { goto } from '$app/navigation';
$: shareable = qse({ q: query });
$: browser && goto(shareable, { replaceState: true });
```
