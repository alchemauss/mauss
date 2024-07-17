import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as bits from './index.js';

const suites = {
	'string/lcs': suite('string/lcs'),

	'number/power': suite('number/power'),
};

suites['string/lcs']('longest common substring', () => {
	assert.equal(bits.lcs('', ''), '');
	assert.equal(bits.lcs('ABC', ''), '');
	assert.equal(bits.lcs('', 'ABC'), '');
	assert.equal(bits.lcs('ABABC', 'BABCA'), 'BABC');
	assert.equal(bits.lcs('BABCA', 'ABCBA'), 'ABC');
	assert.equal(bits.lcs('sea', 'eat'), 'ea');
	assert.equal(bits.lcs('algorithms', 'rithm'), 'rithm');
	assert.equal(
		bits.lcs(
			'Algorithms and data structures implemented in JavaScript',
			'Here you may find Algorithms and data structures that are implemented in JavaScript',
		),
		'Algorithms and data structures ',
	);

	// handle unicode correctly
	assert.equal(bits.lcs('𐌵𐌵**ABC', '𐌵𐌵--ABC'), 'ABC');
	assert.equal(bits.lcs('𐌵𐌵**A', '𐌵𐌵--A'), '𐌵𐌵');
	assert.equal(bits.lcs('A买B时', '买B时GD'), '买B时');
	assert.equal(bits.lcs('After test买时 case', 'another_test买时'), 'test买时');
});

suites['number/power']('power correctness', () => {
	assert.equal(bits.power(1, 1), 1);
	assert.equal(bits.power(2, 0), 1);
	assert.equal(bits.power(2, 3), 8);
	assert.equal(bits.power(2, 6), 64);
	assert.equal(bits.power(2, 8), 256);
	assert.equal(bits.power(3, 5), 243);
	assert.equal(bits.power(13, 4), 28561);
});

Object.values(suites).forEach((v) => v.run());
