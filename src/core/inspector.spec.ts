import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as compare from './inspector.js';

const basics = {
	comparator: suite('comparator'),

	wildcard: suite('compare:wildcard'),

	undefined: suite('compare:undefined'),
	boolean: suite('compare:boolean'),
	number: suite('compare:number'),
	bigint: suite('compare:bigint'),
	symbol: suite('compare:symbol'),
	string: suite('compare:string'),
	object: suite('compare:object'),

	date: suite('compare:date'),
	time: suite('compare:time'),

	order: suite('compare:order'),
};

const composite = {
	order: suite('compare[key]:order'),
};

// ---- standard ----

basics.comparator('comparator', () => {
	assert.type(compare.comparator, 'function');

	const data = [{ id: 0, name: 'B' }, { name: 'A' }, { id: 1, name: 'C' }];
	assert.equal(data.sort(compare.comparator), [
		{ name: 'A' }, // name sorted first as it's the common denominator
		{ id: 1, name: 'C' }, // id takes over since it's defined first
		{ id: 0, name: 'B' },
	]);
});

basics.undefined('sort undefined values with null values above', () => {
	assert.equal(
		[undefined, 3, 0, null, 1, -1, undefined, -2, undefined, null].sort(compare.undefined),
		[3, 0, 1, -1, -2, null, null, undefined, undefined, undefined]
	);
});
basics.boolean('sort boolean values with true above', () => {
	assert.equal(
		[true, false, true, false, true, false, true, false, true, false].sort(compare.boolean),
		[true, true, true, true, true, false, false, false, false, false]
	);
});
basics.number('sort number in descending order', () => {
	assert.equal(
		[5, 3, 9, 6, 0, 2, 1, -1, 4, -2].sort(compare.number),
		[9, 6, 5, 4, 3, 2, 1, 0, -1, -2]
	);
});
basics.string('sort string in alphabetical order', () => {
	assert.equal(
		['k', 'h', 'g', 'f', 'e', 'l', 'd', 'm', 'c', 'b', 'j', 'i', 'a'].sort(compare.string),
		['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm']
	);
	assert.equal(
		['K', 'H', 'G', 'F', 'E', 'L', 'D', 'M', 'C', 'B', 'J', 'I', 'A'].sort(compare.string),
		['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
	);
});

basics.order('customized compare with order', () => {
	const months = ['January', 'February', 'March', 'April', 'May', 'June'];
	const list = ['March', 'June', 'May', 'April', 'January', 'June', 'February'];
	const result = ['January', 'February', 'March', 'April', 'May', 'June', 'June'];
	assert.equal(list.sort(compare.order(months)), result);
});

Object.values(basics).forEach((v) => v.run());

// ---- composite ----

composite.order('keyed compare with order', () => {
	const months = ['January', 'February', 'March', 'April', 'May', 'June'];
	const posts = [
		{ month: 'March' },
		{ month: 'June' },
		{ month: 'May' },
		{ month: 'April' },
		{ month: 'January' },
		{ month: 'June' },
		{ month: 'February' },
	];
	assert.equal(posts.sort(compare.key('month', compare.order(months))), [
		{ month: 'January' },
		{ month: 'February' },
		{ month: 'March' },
		{ month: 'April' },
		{ month: 'May' },
		{ month: 'June' },
		{ month: 'June' },
	]);
});

Object.values(composite).forEach((v) => v.run());
