# mauss/utils

```js
import { :util } from 'mauss/utils';
```

## `capitalize`

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

## `dt`

Simple `date/time` (`dt`) utility namespace.

```ts
type DateValue = string | number | Date;

interface BuildOptions {
  base?: 'UTC';
}

interface TravelOptions {
  /** relative point of reference to travel */
  from?: DateValue;
  /** relative days to travel in number */
  to: number;
}

export const dt: {
  current(d?: DateValue): Date;
  build(options: BuildOptions): (date?: DateValue) => (mask?: string) => string;
  format: ReturnType<typeof this.build>;
  travel({ from, to }: TravelOptions): Date;
}
```

- `dt.current` is a function `(d?: DateValue) => Date` that optionally takes in a `DateValue` to be converted into a `Date` object, `new Date()` will be used if nothing is passed
- `dt.build` is a function that accepts `BuildOptions` and builds a formatter, a convenience export is included with all the default options as `dt.format`
- `dt.format` is a function that takes in a `DateValue` and returns a renderer that accepts a string mask to format the date in, defaults to `'DDDD, DD MMMM YYYY'`
- `dt.travel` is a function `({ from, to }) => Date` that takes in a `{ from, to }` object with `from` property being optional

## `tryNumber`

will check an input and convert to number when applicable, otherwise it will return the input as is.

```ts
type Possibilities = string | number | null | undefined;

export function tryNumber<Input extends Possibilities, Fallback = Input>(
  input: Input,
  fallback?: Fallback
): Input is number ? number : Fallback | Input;
```

Example inputs and outputs

```js
tryNumber('0');  // 0
tryNumber(0);    // 0
tryNumber('1H'); // '1H'
```

## `random`

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
