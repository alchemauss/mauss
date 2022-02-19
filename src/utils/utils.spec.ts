import { suite } from 'uvu';
import assert from 'uvu/assert';
import * as utils from '.';

const basics = [suite('capitalize')];

basics[0]('change one letter for one word', () => {
	assert.equal(utils.capitalize('hello'), 'Hello');
});
basics[0]('change two letter for two words', () => {
	assert.equal(utils.capitalize('hello world'), 'Hello World');
});

basics.forEach((v) => v.run());
