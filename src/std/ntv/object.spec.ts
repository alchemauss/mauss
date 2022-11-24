import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import * as ntv from './object.js';

const basics = {
	entries: suite('obj:entries'),
	freeze: suite('obj:freeze'),
	iterate: suite('obj:iterate'),
	keys: suite('obj:keys'),
};

basics.entries('return object entries', () => {
	assert.equal(ntv.entries({ hello: 'world', foo: 0, bar: { baz: 1 } }), [
		['hello', 'world'],
		['foo', 0],
		['bar', { baz: 1 }],
	]);
});

basics.freeze('deep freezes nested objects', () => {
	const nested = ntv.freeze({
		foo: { a: 0 },
		bar: { b: 1 },
	});

	assert.ok(Object.isFrozen(nested));
	assert.ok(Object.isFrozen(nested.foo));
	assert.ok(Object.isFrozen(nested.bar));
});
basics.freeze('deep freeze ignore function', () => {
	const nested = ntv.freeze({
		identity: (v: any) => v,
		namespace: { a() {} },
	});

	assert.ok(!Object.isFrozen(nested.identity));
	assert.equal(nested.identity(0), 0);
	assert.ok(!Object.isFrozen(nested.namespace.a));
});

basics.iterate('iterate over nested objects', () => {
	const months = 'jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec'.split(',');
	const currencies = 'usd,eur,sgd,gbp,aud,jpy'.split(',');

	const statement = currencies.reduce(
		(cs, c) => ({ ...cs, [c]: { income: 100, expense: 40 } }),
		{} as { [k: string]: { income: number; expense: number } }
	);
	const nested = months.reduce(
		(ms, m) => ({ ...ms, [m]: statement }),
		{} as { [k: string]: typeof statement }
	);

	assert.equal(
		ntv.iterate(nested, ([month, v]) => {
			const updated = ntv.iterate(v, ([currency, { income, expense }]) => {
				return [currency, { balance: income - expense }];
			});
			return [month, updated];
		}),
		months.reduce((a, m) => {
			// @ts-ignore
			a[m] = {
				usd: { balance: 60 },
				eur: { balance: 60 },
				sgd: { balance: 60 },
				gbp: { balance: 60 },
				aud: { balance: 60 },
				jpy: { balance: 60 },
			};
			return a;
		}, {})
	);
});
basics.iterate('iterate with empty/falsy return', () => {
	assert.equal(
		ntv.iterate({}, ([]) => {}),
		{}
	);

	assert.equal(
		ntv.iterate(
			{ a: '0', b: 1, c: null, d: '3', e: undefined, f: false },
			([k, v]) => v != null && v !== false && [k, v]
		),
		{ a: '0', b: 1, d: '3' }
	);
});

basics.keys('return object keys', () => {
	assert.equal(ntv.keys({ a: 0, b: 1, c: 2 }), ['a', 'b', 'c']);
});

Object.values(basics).forEach((v) => v.run());
