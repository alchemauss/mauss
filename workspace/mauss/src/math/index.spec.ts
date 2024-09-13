import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as math from './index.js';

const suites = {
	'average/': suite('math/average'),
	'modulo/': suite('math/modulo'),
};

suites['average/']('average base cases', () => {
	assert.equal(math.average([]), 0);
});
suites['average/']('average numbers', () => {
	assert.equal(math.average([1, 2, 3, 4, 5]), 3);
	assert.equal(math.average([10, 20, 30, 40, 50]), 30);
});

suites['modulo/']('modulo numbers', () => {
	assert.equal(math.modulo(10, 0), NaN);

	assert.equal(math.modulo(10, 3), 1);
	assert.equal(math.modulo(-10, 3), 2);
	assert.equal(math.modulo(10, -3), -2);
	assert.equal(math.modulo(-10, -3), -1);
	assert.equal(math.modulo(10, 5), 0);
	assert.equal(math.modulo(-10, 5), 0);
	assert.equal(math.modulo(10, -5), 0);
	assert.equal(math.modulo(-10, -5), 0);
	assert.equal(math.modulo(10, 1), 0);
	assert.equal(math.modulo(10, 10), 0);
});

Object.values(suites).forEach((v) => v.run());
