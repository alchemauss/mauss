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

Simple `date/time` (`dt`) utility namespace

```ts
type DateValue = string | number | Date;

interface FormatOptions {
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
  format(options: FormatOptions): (date?: DateValue) => (mask?: string) => string;
  travel({ from, to }: TravelOptions): Date;
}
```

- `dt.current` is a function `(d?: DateValue) => Date` that optionally takes in a `DateValue` to be converted into a `Date` object, `new Date()` will be used if nothing is passed
- `dt.format` is a function `(date: DateValue, mask = 'DDDD, DD MMMM YYYY', base?: 'UTC') => string` that takes in a `DateValue`, optionally a mask that defaults to `'DDDD, DD MMMM YYYY'`, and optionally `'UTC'` as the last argument
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

***

<h3 align="center"><pre>Mauss | <a href="LICENSE">MIT License</a></pre></h3>
