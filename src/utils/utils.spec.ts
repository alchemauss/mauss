import { suite } from 'uvu';
import assert from 'uvu/assert';
import * as utils from '.';

const basics = [suite('capitalize'), suite('tryNumber')];

// ---- capitalize ----

basics[0]('change one letter for one word', () => {
	assert.equal(utils.capitalize('hello'), 'Hello');
});
basics[0]('change two letter for two words', () => {
	assert.equal(utils.capitalize('hello world'), 'Hello World');
});

// ---- tryNumber ----

basics[1]('convert numbers properly', () => {
	assert.equal(utils.tryNumber('0'), 0);
	assert.equal(utils.tryNumber('1'), 1);
	assert.equal(utils.tryNumber('-1'), -1);
	assert.equal(utils.tryNumber('1e3'), 1e3);
});

basics[1]('convert strings as-is', () => {
	assert.equal(utils.tryNumber('a'), 'a');
	assert.equal(utils.tryNumber('a1a'), 'a1a');
	assert.equal(utils.tryNumber('1a1'), '1a1');
	assert.equal(utils.tryNumber('-1a'), '-1a');
	assert.equal(utils.tryNumber('-1e'), '-1e');
});

basics.forEach((v) => v.run());
