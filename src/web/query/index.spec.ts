import { suite } from 'uvu';
import assert from 'uvu/assert';

import qsd from './decoder';
import qse from './encoder';

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
		[{ hi: 'mom', hello: 'world' }, 'hi=mom&hello=world'],
		[{ payload, foo: 'bar' }, 'payload=dynamic&foo=bar'],
		[{ fam: ['mom', 'dad', 'sis'] }, 'fam=mom&fam=dad&fam=sis'],
	] as const;

	for (const [input, output] of pairs) {
		assert.equal(qse(input), output);
	}
});
basics.encoder('transform final string if it exists', () => {
	const bound = { q: '' };
	const transform = (v: string) => `?${v}`;

	assert.equal(qse(bound, transform), '');

	bound.q = 'hi';
	assert.equal(qse(bound, transform), '?q=hi');
});

Object.values(basics).forEach((v) => v.run());
