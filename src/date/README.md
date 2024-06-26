# mauss/date

Simple `date/time` utility module.

```ts
type DateValue = string | number | Date;

export function current(d?: DateValue): Date;

interface BuildOptions {
	base?: 'UTC';
}
export function build(options: BuildOptions): (date?: DateValue) => (mask?: string) => string;

export function format: ReturnType<typeof this.build>;

interface TravelOptions {
	/** relative point of reference to travel */
	from?: DateValue;
	/** relative days to travel in number */
	to: number;
}
export function travel({ from, to }: TravelOptions): Date;
```

-   `current` is a function `(d?: DateValue) => Date` that optionally takes in a `DateValue` to be converted into a `Date` object, `new Date()` will be used if nothing is passed
-   `build` is a function that accepts `BuildOptions` and builds a formatter, a convenience export is included with all the default options as `format`
-   `format` is a function that takes in a `DateValue` and returns a renderer that accepts a string mask to format the date in, defaults to `'DDDD, DD MMMM YYYY'`
-   `travel` is a function `({ from, to }) => Date` that takes in a `{ from, to }` object with `from` property being optional
