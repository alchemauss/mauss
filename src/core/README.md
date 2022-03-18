# mauss

```js
import { :util } from 'mauss';
```

## `regexp`

A drop-in replacement for `new RegExp()` with special characters from source string escaped

## `debounce/throttle`

```js
function search(name) {...}

const dSearch = debounce(search, 500);
const tSearch = throttle(search, 500);

dSearch('mauss'); // execute after 500ms
tSearch('mauss'); // execute every 500ms
```

## `compare/comparator`

compare utility object with multiple methods for various types, and comparator function that can sort any array of object (but only objects).

```js
compare.string('abc', 'def');
// and other primitives

[/* data */].sort(comparator);
```
