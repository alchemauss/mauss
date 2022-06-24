import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { compare, comparator } from './inspector';

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

	key: suite('compare:key'),
};

// ---- standard ----

basics.comparator('comparator', () => {
	assert.type(comparator, 'function');

	const data = [{ id: 0, name: 'B' }, { name: 'A' }, { id: 1, name: 'C' }];
	assert.equal(data.sort(comparator), [
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
basics.number('sort number in descending order', () => {
	assert.equal(
		[5, 3, 9, 6, 0, 2, 1, -1, 4, -2].sort(compare.number),
		[9, 6, 5, 4, 3, 2, 1, 0, -1, -2]
	);
});

Object.values(basics).forEach((v) => v.run());
