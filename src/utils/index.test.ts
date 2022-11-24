import { tryNumber } from './index.js';

declare function expect<T>(v: T): void;

expect<''>(tryNumber(''));
expect<number>(tryNumber(null));
expect<number>(tryNumber(0));
expect<number>(tryNumber(1));
expect<number>(tryNumber('0'));
expect<number>(tryNumber('1'));
expect<number>(tryNumber('12'));
expect<number>(tryNumber('123'));
expect<number>(tryNumber('123456'));
expect<'asd'>(tryNumber('asd'));
expect<'123asd'>(tryNumber('123asd'));
expect<'asd123'>(tryNumber('asd123'));
expect<'123asd123'>(tryNumber('123asd123'));
expect<'asd123asd'>(tryNumber('asd123asd'));
expect<'12as'>(tryNumber('12as'));

// @ts-expect-error
expect<number>(tryNumber('nan'));
// @ts-expect-error
expect<number>(tryNumber('000nope'));
// @ts-expect-error
expect<string>(tryNumber('123'));
