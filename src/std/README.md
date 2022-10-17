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
