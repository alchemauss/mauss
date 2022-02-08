# Mauss ![Total npm downloads](https://img.shields.io/npm/dt/mauss) &middot; ![Published npm version](https://img.shields.io/npm/v/mauss) ![Monthly npm downloads](https://img.shields.io/npm/dm/mauss) ![License](https://img.shields.io/github/license/alchemauss/mauss)

> Declarative Type-Safe Zero-Dependency SDK

A collection of development tools written with TypeScript.

Ever been frustrated when starting up a new project? Feels like there's a lot to setup and prepare even before writing the actual code itself? Perhaps annoyed by having to write the same code to help you do something each time? This might be the library for you.

## Installation

```bash
npm install mauss
```

### Disclaimer

Although it's meant to be versatile, there will most likely be something that this library doesn't cover, but hopefully it can still be useful in most situations.

There's still a lot of room for improvements, so if there's something you think are essential that is missing and you feel it should be here, feel free to open an issue for it!

***

<h3 align="center"><pre>API Documentation</pre></h3>

***

The headings refers to the namespaces available to import from. Replace `:util` in the import with the actual exported functions and objects. You shouldn't need to refer to this docs as frequently if you're using a text editor that supports reading `.d.ts` files like VSCode. But, feel free to read and improve as needed.

## mauss

```js
import { :util } from 'mauss';
```

### `regexp`

A drop-in replacement for `new RegExp()` with special characters from source string escaped

### `debounce/throttle`

```js
function search(name) {...}

const dSearch = debounce(search, 500);
const tSearch = throttle(search, 500);

dSearch('mauss'); // execute after 500ms
tSearch('mauss'); // execute every 500ms
```

### `compare/comparator`

compare utility object with multiple methods for various types, and comparator function that can sort any array of object (but only objects).

```js
compare.string('abc', 'def');
// and other primitives

[/* data */].sort(comparator);
```

## mauss/api

This defaults to `fetch` api from browser, but you can also use it on the server-side by first installing the package `node-fetch`. If you're using something like [SvelteKit](https://github.com/sveltejs/kit) that polyfills `fetch` globally, you won't have to worry about installing this.

```bash
npm install node-fetch
```

You can set a custom rule by calling `init` as early as possible. This is optional and might be useful for pointing to both same and external domain at the same time.

```js
import api from 'mauss/api';

api.init({
  host: process.env.NODE_ENV === 'production' ? 'mauss.dev' : 'localhost:3000',

  intercept(path) { /* returns a value that will be used as url for `fetch(url)` */
    const base = process.env.NODE_ENV !== 'production'
      ? 'https://development.url/api'
      : 'https://production.url/api';

    /* if path starts with '/', point to prod url, else same-domain */
    return path[0] !== '/' ? `${base}/${path}` : path.slice(1);
  }
});
```

All the available exported API can be passed a url string or object of `{ path, fetch }`. This is especially useful for users working with [`load` function in SvelteKit](https://kit.svelte.dev/docs#loading-input-fetch) as `fetch` can be passed down the api call.

```js
import { get, post } from 'mauss/api';

const token = 'jwt:token'; // optional, pass for authenticated request

/* GET example */
const { response, body, error } = await get('auth/profile', token);
if (response.ok) {
  console.log(body);  // user data in JSON format
} else {
  console.log(error); // error message in string
}

/* POST example */
const { response, body, error } = await post('auth/login', {
  email: 'mail@example.com',
  password: 'super_secure_password'
});
if (response.ok) {
  console.log(body);  // response body
} else {
  console.log(error); // error message
}
```

## mauss/bits

```js
import { :util } from 'mauss/bits';
```

### `find.binary`

do a binary search on a sorted array with custom item checking and cutoff function.

### `find.minmax`

find the minimum and maximum value in an array of numbers.

```js
const [min, max] = minmax([0, 1, 2, 3, 4, 5]);
// min = 0, max = 5
```

## mauss/guards

Collection of guard functions to pass TypeScript checks.

```js
import { :util } from 'mauss/guards';
```

## mauss/math

```js
import { :util } from 'mauss/math';
```

### `permutation`

generate all possible permutations from all items in an array.

## mauss/typings

Collection of TypeScript type helpers.

```js
import { :util } from 'mauss/typings';
```

## mauss/utils

```js
import { :util } from 'mauss/utils';
```

### `capitalize`

```ts
interface CapitalizeOptions {
	/** only capitalize the very first letter */
	cap?: boolean;
	/** convert the remaining word to lowercase */
	normalize?: boolean;
}
export function capitalize(text: string, options?: CapitalizeOptions): string;
```

```js
capitalize('hi there'); // 'Hi There'
capitalize('hI thErE'); // 'HI ThErE'
capitalize('hI thErE', { cap: true }); // 'HI thErE'
capitalize('hI thErE', { normalize: true }); // 'Hi There'
capitalize('hI thErE', { cap: true, normalize: true }); // 'Hi there'
```

### `dt`

Simple `date/time` (`dt`) utility object

```ts
type DateValue = string | number | Date;
interface TravelOptions {
	/** relative point of reference to travel */
	from?: DateValue;
	/** relative days to travel in number */
	to: number;
}

export const dt: {
  readonly now: Date;
  new(d?: DateValue): Date;
  format(date: DateValue, mask?: string, base?: 'UTC'): string;
  travel({ from, to }: TravelOptions): Date;
}
```

- `dt.now` is a shortcut to `new Date()`
- `dt.new` is a function `(date?: DateValue) => Date` that optionally takes in a `DateValue` to be converted into a `Date` object
- `dt.format` is a function `(date: DateValue, mask = 'DDDD, DD MMMM YYYY', base?: 'UTC') => string` that takes in a `DateValue`, optionally a mask that defaults to `'DDDD, DD MMMM YYYY'`, and optionally `'UTC'` as the last argument
- `dt.travel` is a function `({ from, to }) => Date` that takes in a `{ from, to }` object with `from` property being optional

### `tryNumber`

will check an input and convert to number when applicable, otherwise it will return the input as is.

```js
tryNumber('0');  // 0
tryNumber(0);    // 0
tryNumber('1H'); // '1H'
```

### `random`

```js
/** random number from [min, max) */
random.int(2);    // 0 - 1
random.int(1000); // 0 - 999
random.int(9, 1); // 1 - 8

/** random key from any object */
const data = { a: {}, b: 1, c: [3] };
// returns a random value from an object
random.key(data); // a || 1 || [3]
```

## mauss/web

```js
import { :util } from 'mauss/web';
```

### `cookies`

Homemade baked cookies for server and client side usage.

### `qpm`

```js
// https://mauss.dev/reviews

let query = 'anything'; // a reactive variable
const type = 1;

const updated = qpm({ q: query, type });
history.replaceState({}, '', updated);
// https://mauss.dev/reviews?q=anything&type=1
```

With SvelteKit:

```svelte
<script>
  import { browser } from '$app/env';
  import { goto } from '$app/navigation';
  $: shareable = qpm({ q: query });
  $: browser && goto(shareable, { replaceState: true });
</script>
```

***

<h3 align="center"><pre>Mauss | <a href="LICENSE">MIT License</a></pre></h3>
