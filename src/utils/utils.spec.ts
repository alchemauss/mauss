import { suite } from 'uvu';
import assert from 'uvu/assert';
import * as utils from '.';

const basic = suite('basic');

basic('change one letter for one word', () => {
	assert.equal(utils.capitalize('hello'), 'Hello');
});
basic('change two letter for two words', () => {
	assert.equal(utils.capitalize('hello world'), 'Hello World');
});

basic.run();
