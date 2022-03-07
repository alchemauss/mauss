import { suite } from 'uvu';
import assert from 'uvu/assert';
import qsd from './decoder';
import qse from './encoder';

const basics = [suite('query:decoder'), suite('query:encoder')];

// ---- decoder ----

basics[0]('decode query string to object', () => {
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

basics[1]('encode object to query string', () => {
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

basics.forEach((v) => v.run());
