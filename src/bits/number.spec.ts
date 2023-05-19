import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as num from './number.js';

const suites = {
	'power/': suite('number/power'),
};

suites['power/']('power correctness', () => {
	assert.equal(num.power(1, 1), 1);
	assert.equal(num.power(2, 0), 1);
	assert.equal(num.power(2, 3), 8);
	assert.equal(num.power(2, 6), 64);
	assert.equal(num.power(2, 8), 256);
	assert.equal(num.power(3, 5), 243);
	assert.equal(num.power(13, 4), 28561);
});

Object.values(suites).forEach((v) => v.run());
