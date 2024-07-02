import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import * as ntv from './object.js';

const suites = {
	'obj/clone': suite('obj/clone'),
	'obj/entries': suite('obj/entries'),
	'obj/freeze': suite('obj/freeze'),
	'obj/iterate': suite('obj/iterate'),
	'obj/keys': suite('obj/keys'),
	'obj/pick': suite('obj/pick'),
	'obj/size': suite('obj/size'),
};

suites['obj/clone']('clone any possible data type', () => {
	const base = { arr: [0, 'hi', /wut/], obj: { now: new Date() } };
	const cloned = ntv.clone(base);

	assert.ok(base !== cloned);
	assert.ok(base.arr !== cloned.arr);
	assert.ok(base.obj !== cloned.obj);

	assert.equal(base.arr, cloned.arr);
	assert.equal(base.obj, cloned.obj);
	assert.equal(base.arr[2], cloned.arr[2]);
	assert.equal(base.obj.now, cloned.obj.now);
});

suites['obj/entries']('return object entries', () => {
	assert.equal(ntv.entries({ hello: 'world', foo: 0, bar: { baz: 1 } }), [
		['hello', 'world'],
		['foo', 0],
		['bar', { baz: 1 }],
	]);
});

suites['obj/freeze']('deep freezes nested objects', () => {
	const nested = ntv.freeze({
		foo: { a: 0 },
		bar: { b: 1 },
	});

	assert.ok(Object.isFrozen(nested));
	assert.ok(Object.isFrozen(nested.foo));
	assert.ok(Object.isFrozen(nested.bar));
});
suites['obj/freeze']('deep freeze ignore function', () => {
	const nested = ntv.freeze({
		identity: (v: any) => v,
		namespace: { a() {} },
	});

	assert.ok(!Object.isFrozen(nested.identity));
	assert.equal(nested.identity(0), 0);
	assert.ok(!Object.isFrozen(nested.namespace.a));
});

suites['obj/iterate']('iterate over nested objects', () => {
	const months = 'jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec'.split(',');
	const currencies = 'usd,eur,sgd,gbp,aud,jpy'.split(',');

	const statement = currencies.reduce(
		(cs, c) => ({ ...cs, [c]: { income: 100, expense: 40 } }),
		{} as { [k: string]: { income: number; expense: number } },
	);
	const nested = months.reduce(
		(ms, m) => ({ ...ms, [m]: statement }),
		{} as { [k: string]: typeof statement },
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
		}, {}),
	);
});
suites['obj/iterate']('iterate with empty/falsy return', () => {
	assert.equal(
		ntv.iterate({}, ([]) => {}),
		{},
	);

	assert.equal(
		ntv.iterate(
			{ a: '0', b: 1, c: null, d: '3', e: undefined, f: false },
			([k, v]) => v != null && v !== false && [k, v],
		),
		{ a: '0', b: 1, d: '3' },
	);

	type Nested = { [P in 'a' | 'b']?: { [K in 'x' | 'y']: { foo: string } } };
	ntv.iterate({ a: { x: { foo: 'ax' } } } as Nested, ([parent, v]) => {
		assert.equal(parent, 'a');
		v &&
			ntv.iterate(v, ([key, { foo }]) => {
				assert.equal(key, 'x');
				assert.equal(foo, 'ax');
			});
	});
});
suites['obj/iterate']('iterate creates deep copy', () => {
	const original = { x: 1, y: { z: 'foo' } };
	const copy = ntv.iterate(original);
	assert.ok(original !== copy);
	assert.ok(original.y !== copy.y);
});

suites['obj/keys']('return object keys', () => {
	assert.equal(ntv.keys({ a: 0, b: 1, c: 2 }), ['a', 'b', 'c']);
});

suites['obj/pick']('pick properties from an object', () => {
	const { build, filter } = ntv.pick(['a', 'b', 'c', 'd', 'e', 'z']);

	assert.equal(build({ a: 0, c: 'b', z: null }), {
		a: 0,
		b: null,
		c: 'b',
		d: null,
		e: null,
		z: null,
	});

	assert.equal(filter({ a: 0, c: 'b', y: undefined, z: null }), {
		a: 0,
		c: 'b',
		z: null,
	});
});

suites['obj/size']('return size of an object', () => {
	assert.equal(ntv.size({ a: 0, b: 1, c: 2 }), 3);
});

Object.values(suites).forEach((v) => v.run());
