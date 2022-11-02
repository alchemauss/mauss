import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import qsd from './decoder.js';
import qse from './encoder.js';

const basics = {
	decoder: suite('query:decoder'),
	encoder: suite('query:encoder'),
};

// ---- decoder ----

basics.decoder('decode query string to object', () => {
	const pairs = [
		['?hi=mom&hello=world', { hi: 'mom', hello: 'world' }],
		['fam=mom&fam=dad&fam=sis', { fam: ['mom', 'dad', 'sis'] }],
		['dynamic=value' as string, { dynamic: 'value' }],
	] as const;

	for (const [input, output] of pairs) {
		assert.equal(qsd(input), output);
	}
});

// ---- encoder ----

basics.encoder('encode object to query string', () => {
	let payload: string = 'dynamic';
	const pairs = [
		[{ hi: 'mom', hello: 'world' }, '?hi=mom&hello=world'],
		[{ payload, foo: 'bar' }, '?payload=dynamic&foo=bar'],
		[{ fam: ['mom', 'dad', 'sis'] }, '?fam=mom&fam=dad&fam=sis'],
		[{ escape: 'spa zio!' }, '?escape=spa%20zio!'],
		[{ brackets: '[dynamic]' }, '?brackets=%5Bdynamic%5D'],
		[{ '[brackets]': 'boo' }, '?%5Bbrackets%5D=boo'],
	] as const;

	for (const [input, output] of pairs) {
		assert.equal(qse(input), output);
	}
});
basics.encoder('transform final string if it exists', () => {
	const bound = { q: '' };

	assert.equal(qse(bound), '');

	bound.q = 'hi';
	assert.equal(qse(bound), '?q=hi');
});

Object.values(basics).forEach((v) => v.run());
