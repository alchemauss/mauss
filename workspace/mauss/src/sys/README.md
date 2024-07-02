# mauss/sys

System module implementation, independent of runtime environment.

## `catenate`

Joins all given parameters together using `/`, regardless of the platform.

```ts
export function catenate(...paths: string[]): string;
```
