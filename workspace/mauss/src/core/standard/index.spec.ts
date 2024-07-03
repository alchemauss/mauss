import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as std from './index.js';

const suites = {
	'capitalize/': suite('std/capitalize'),
	'identical/': suite('std/identical'),
	'sides/': suite('std/sides'),
};

suites['capitalize/']('change one letter for one word', () => {
	assert.equal(std.capitalize('hello'), 'Hello');
});
suites['capitalize/']('change two letter for two words', () => {
	assert.equal(std.capitalize('hello world'), 'Hello World');
});

suites['identical/']('identical primitive checks', () => {
	// boolean
	assert.ok(std.identical(true, true));
	assert.ok(!std.identical(true, false));
	// string
	assert.ok(std.identical('a', 'a'));
	assert.ok(!std.identical('a', 'b'));
	// number
	assert.ok(std.identical(1, 1));
	assert.ok(!std.identical(1, 2));
	// bigint
	assert.ok(std.identical(0n, 0n));
	assert.ok(std.identical(1n, 1n));
	assert.ok(!std.identical(0n, 1n));
	assert.ok(!std.identical(0n, 0));
	assert.ok(!std.identical(0n, 1));
	assert.ok(!std.identical(1n, 0));
	assert.ok(!std.identical(1n, 1));
	// symbol
	assert.ok(std.identical(Symbol('abc'), Symbol('abc')));
	assert.ok(!std.identical(Symbol(0), Symbol('foo')));
	// null/undefined
	assert.ok(std.identical(null, null));
	assert.ok(std.identical(undefined, undefined));
	assert.ok(!std.identical(null, undefined));
	assert.ok(!std.identical(undefined, 0));
	assert.ok(!std.identical(undefined, ''));
	// function - true for any function comparison
	assert.ok(
		std.identical(
			() => {},
			() => {},
		),
	);
	assert.ok(
		std.identical(
			() => '',
			() => 0,
		),
	);
});
suites['identical/']('identical array checks', () => {
	assert.ok(std.identical([], []));
	assert.ok(std.identical(['', 1, !0], ['', 1, !0]));
	assert.ok(std.identical([{ x: [] }], [{ x: [] }]));
	assert.ok(!std.identical(['', 0, !0], ['', 1, !1]));
	assert.ok(!std.identical([{ x: [] }], [{ y: [] }]));
});
suites['identical/']('identical object checks', () => {
	assert.ok(std.identical({}, {}));
	assert.ok(std.identical({ a: '', b: 1, c: !0 }, { a: '', b: 1, c: !0 }));
	assert.ok(std.identical({ x: [{}], y: { a: 0 } }, { x: [{}], y: { a: 0 } }));
});
suites['identical/']('identical clone', async () => {
	const { clone } = await import('../../std/index.js');
	const data = { a: [1, '', {}], o: { now: new Date() } };
	assert.ok(std.identical(data, clone(data)));
});

suites['sides/']('first and last element', () => {
	assert.equal(std.sides(''), { head: undefined, last: undefined });
	assert.equal(std.sides([]), { head: undefined, last: undefined });

	assert.equal(std.sides('abz'), { head: 'a', last: 'z' });
	assert.equal(std.sides([{ a: 0 }, { z: 'i' }]), { head: { a: 0 }, last: { z: 'i' } });
});

Object.values(suites).forEach((v) => v.run());
