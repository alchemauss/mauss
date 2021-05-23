import * as utils from '../../src/utils';

describe('capitalize', () => {
	it('change one letter for one word', () => {
		expect(utils.capitalize('hello')).toBe('Hello');
	});
	it('change two letter for two words', () => {
		expect(utils.capitalize('hello world')).toBe('Hello World');
	});
});
