import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { compare, comparator } from './inspector';

const basics = {
	comparator: suite('comparator'),
	number: suite('compare:number'),
};

// ---- standard ----

basics.comparator('comparator', () => {
	assert.type(comparator, 'function');
});

basics.number('sort number in descending order', () => {
	assert.equal(
		[5, 3, 9, 6, 0, 2, 1, -1, 4, -2].sort(compare.number),
		[9, 6, 5, 4, 3, 2, 1, 0, -1, -2]
	);
});

Object.values(basics).forEach((v) => v.run());
