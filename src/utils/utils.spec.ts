import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as utils from '.';

const basics = {
	capitalize: suite('capitalize'),
	tryNumber: suite('tryNumber'),
};

// ---- capitalize ----

basics.capitalize('change one letter for one word', () => {
	assert.equal(utils.capitalize('hello'), 'Hello');
});
basics.capitalize('change two letter for two words', () => {
	assert.equal(utils.capitalize('hello world'), 'Hello World');
});

// ---- tryNumber ----

basics.tryNumber('convert to numbers', () => {
	assert.equal(utils.tryNumber(null), 0);
	assert.equal(utils.tryNumber('0'), 0);
	assert.equal(utils.tryNumber('1'), 1);
	assert.equal(utils.tryNumber('-1'), -1);
	assert.equal(utils.tryNumber('1e3'), 1e3);
});

basics.tryNumber('fallback to original value as-is', () => {
	assert.equal(utils.tryNumber('a'), 'a');
	assert.equal(utils.tryNumber('a1a'), 'a1a');
	assert.equal(utils.tryNumber('1a1'), '1a1');
	assert.equal(utils.tryNumber('-1a'), '-1a');
	assert.equal(utils.tryNumber('-1e'), '-1e');

	const dyn: string = 'dynamic';
	assert.equal(utils.tryNumber(dyn), 'dynamic');
	assert.equal(utils.tryNumber(undefined), undefined);
});

basics.tryNumber('fallback to provided as expected', () => {
	assert.equal(utils.tryNumber('a', 0), 0);
	assert.equal(utils.tryNumber('a', 1), 1);
});

Object.values(basics).forEach((v) => v.run());
