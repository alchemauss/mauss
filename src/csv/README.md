# mauss/csv

CSV parser to read a valid string.

## `read`

```typescript
export function read(content: string): string[][];
```

```javascript
import { readFileSync } from 'fs';
import { read } from 'mauss/csv';
const csv = read(readFileSync('./data.csv', 'utf-8'));
```
