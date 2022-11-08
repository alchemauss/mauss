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

## `sys`

System module independent of runtime environment.

### `path`

Utilities for working with URL, file, and directory paths.

#### `path.join`

Joins all given parameters together using `/`, regardless of the platform.

```ts
export function join(...paths: string[]): string;
```
