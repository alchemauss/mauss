# Mauss ![Total npm downloads](https://img.shields.io/npm/dt/mauss) &middot; ![Published npm version](https://img.shields.io/npm/v/mauss) ![Monthly npm downloads](https://img.shields.io/npm/dm/mauss) ![License](https://img.shields.io/github/license/devmauss/mauss)

A Complete Zero-Dependency Development Toolkit. Mauss is a collection of development tools written in TypeScript. Completely self-contained with utility functions and helpers that's frequently used, it is meant to be installed and used immediately.

Ever been frustrated when starting up a new project? Feels like there's a lot to setup and prepare even before writing the actual code itself? Perhaps annoyed by having to write the same code to help you do something each time? This might be the library for you.

## Installation

```bash
npm install mauss
```

### Disclaimer

This library is written with DevMauss web projects in mind. Although it's meant to be versatile and can hopefully be used in most situations or use cases, there will most likely be something that this library doesn't cover. Mauss will certainly be updated as it is used in more projects with a variety of use cases.

If there's something you think are essential that is missing and you feel it should be here, please understand that it was specifically excluded to spite you personally. All jokes aside, contributions are welcome! Be it issues or direct PRs.

***

<h3 align="center"><pre>
API Documentation
</pre></h3>

***

The headings refers to the namespaces available to import from. Replace `:util` in the import with the actual exported functions and objects. You shouldn't need to refer to this docs as frequently if you're using a text editor that supports reading `.d.ts` files like VSCode. But, feel free to read and improve as needed.

## `mauss`

```js
import { :util } from 'mauss';
```

### `cookies`

`cookies` can only be used in the browser because it needs to access `document` object. Using this in Node will certainly crash the server.

```js
// This will create a cookie with key of 'token'
// With the value of 'abc123', valid for 1 day
cookies.create('token', 'abc123', 1);

// This will return the value of cookie with key 'token'
// It will return an empty string if it's non-existent
const token = cookies.get('token');

// This will remove the cookie with key 'token'
cookies.remove('token');
```

### `debounce`

```js
function search(name) {...}

const dSearch = debounce(search, 500);

dSearch('mauss'); // will execute after 500ms
// will start over if called again before 500ms is up
```

## `mauss/api`

This defaults to `fetch` api from browser, but you can also use it on the server-side by first installing the package `node-fetch`.

```bash
npm install node-fetch
```

You can set a custom rule by calling `init` as early as possible. You can skip this if you're using it exclusively on the browser only.

```js
import { init } from 'mauss/utils';
init({
  host: process.env.NODE_ENV === 'production' ? 'mauss.dev' : 'localhost:3000',
});

// Setting a custom rule for the url
function check(path) {
  const base = process.env.NODE_ENV !== 'production'
    ? 'https://development.url/api'
    : 'https://production.url/api';

  // RETURN VALUE will be used as url in `fetch(url)`
  return path[0] !== '/' ? `${base}/${path}` : path.slice(1);
}
init({ check }); // Pass the check function
```

## `mauss/utils`

```js
import { :util } from 'mauss/utils';
```

### `capitalize`

```js
capitalize('hi there'); // 'Hi There'
capitalize('hI thErE'); // 'HI ThErE'
capitalize('hI thErE', true); // 'Hi There'
```

### `checkNum`

`checkNum` will check an input and return a parsed number if it is one, otherwise it will return the input as is.

```js
checkNum('0');  // 0
checkNum(0);    // 0
checkNum('1H'); // '1H'
```

### `random`

```js
/** random number from [min, max) */
random.int(2);    // 0 - 1
random.int(1000); // 0 - 999
random.int(9, 1); // 1 - 8

/** random key from any object */
const data = { 'a': a, 'b': 1, 'c': [3] }
random.key(data); // a || 1 || [3]
```

***

<h3 align="center"><pre>
Mauss | <a href="LICENSE">MIT License</a>
</pre></h3>

***

<h5 align="center"><pre>
Copyright &copy; 2020 <a href="https://mauss.dev">Ignatius Bagussuputra</a>
</pre></h5>
