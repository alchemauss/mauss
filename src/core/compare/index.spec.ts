import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as compare from './index.js';

const suites = {
	'inspect/': suite('compare/inspect'),
	'wildcard/': suite('compare/wildcard'),

	'undefined/': suite('compare/undefined'),
	'boolean/': suite('compare/boolean'),
	'number/': suite('compare/number'),
	'bigint/': suite('compare/bigint'),
	'symbol/': suite('compare/symbol'),
	'string/': suite('compare/string'),
	'object/': suite('compare/object'),

	'date/': suite('compare/date'),
	'time/': suite('compare/time'),

	'order/': suite('compare/order'),
	'order/key': suite('compare/order:key'),
} as const;

suites['inspect/']('inspect', () => {
	assert.type(compare.inspect, 'function');

	const data = [{ id: 0, name: 'B' }, { name: 'A' }, { id: 1, name: 'C' }];
	assert.equal(data.sort(compare.inspect), [
		{ name: 'A' }, // name sorted first as it's the common denominator
		{ id: 1, name: 'C' }, // id takes over since it's defined first
		{ id: 0, name: 'B' },
	]);
});

suites['undefined/']('sort undefined values with null values above', () => {
	assert.equal(
		[undefined, 3, 0, null, 1, -1, undefined, -2, undefined, null].sort(compare.undefined),
		[3, 0, 1, -1, -2, null, null, undefined, undefined, undefined]
	);
});

suites['boolean/']('sort boolean values with true above', () => {
	assert.equal(
		[true, false, true, false, true, false, true, false, true, false].sort(compare.boolean),
		[true, true, true, true, true, false, false, false, false, false]
	);
});

suites['number/']('sort number in descending order', () => {
	assert.equal(
		[5, 3, 9, 6, 0, 2, 1, -1, 4, -2].sort(compare.number),
		[9, 6, 5, 4, 3, 2, 1, 0, -1, -2]
	);
});

suites['string/']('sort string in alphabetical order', () => {
	assert.equal(
		['k', 'h', 'g', 'f', 'e', 'l', 'd', 'm', 'c', 'b', 'j', 'i', 'a'].sort(compare.string),
		['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm']
	);
	assert.equal(
		['K', 'H', 'G', 'F', 'E', 'L', 'D', 'M', 'C', 'B', 'J', 'I', 'A'].sort(compare.string),
		['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
	);
});

suites['order/']('customized compare with order', () => {
	const months = ['January', 'February', 'March', 'April', 'May', 'June'];
	const list = ['March', 'June', 'May', 'April', 'January', 'June', 'February'];
	const result = ['January', 'February', 'March', 'April', 'May', 'June', 'June'];
	assert.equal(list.sort(compare.order(months)), result);
});

suites['order/key']('nested keyed compare with order', () => {
	const months = ['January', 'February', 'March', 'April', 'May', 'June'];
	const posts = [
		{ date: { pub: { month: 'March' } } },
		{ date: { pub: { month: 'June' } } },
		{ date: { pub: { month: 'May' } } },
		{ date: { pub: { month: 'April' } } },
		{ date: { pub: { month: 'January' } } },
		{ date: { pub: { month: 'June' } } },
		{ date: { pub: { month: 'February' } } },
	];
	assert.equal(posts.sort(compare.key('date.pub.month', compare.order(months))), [
		{ date: { pub: { month: 'January' } } },
		{ date: { pub: { month: 'February' } } },
		{ date: { pub: { month: 'March' } } },
		{ date: { pub: { month: 'April' } } },
		{ date: { pub: { month: 'May' } } },
		{ date: { pub: { month: 'June' } } },
		{ date: { pub: { month: 'June' } } },
	]);
});

Object.values(suites).forEach((v) => v.run());
