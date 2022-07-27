import { parse } from './json.js';

declare function expect<T>(v: T): void;

let str: string = '';

parse(str); // should this be any?
expect<true>(parse('true'));
expect<false>(parse('false'));
expect<null>(parse('null'));
expect<{}>(parse('{}'));
expect<[]>(parse('[]'));
expect<[0]>(parse('[0]'));
expect<[1]>(parse('[1]'));
expect<[1, 2]>(parse('[1,2]'));
expect<'hello'>(parse('"hello"'));
expect<{}>(parse('  	\n	  {}'));
expect<{
	'hello\r\n\b\f': 'world';
}>(parse('{\n\t"hello\\r\\n\\b\\f": "world"\n}'));
parse(`{
	"a": "b",
	"b": false,
	"c": [true, false, "hello", {
		"a": "b",
		"b": false
	}],
	"nil": null
}`);

// test for trailing comma on array and object
// test for single quotes on object keys
