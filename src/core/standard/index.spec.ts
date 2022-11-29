import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as std from './index.js';

const basics = {
	equivalent: suite('std:equivalent'),
};

basics.equivalent('equivalent primitive checks', () => {
	// boolean
	assert.ok(std.equivalent(true, true));
	assert.ok(!std.equivalent(true, false));
	// string
	assert.ok(std.equivalent('a', 'a'));
	assert.ok(!std.equivalent('a', 'b'));
	// number
	assert.ok(std.equivalent(1, 1));
	assert.ok(!std.equivalent(1, 2));
	// bigint
	assert.ok(std.equivalent(0n, 0n));
	assert.ok(std.equivalent(1n, 1n));
	assert.ok(!std.equivalent(0n, 1n));
	assert.ok(!std.equivalent(0n, 0));
	assert.ok(!std.equivalent(0n, 1));
	assert.ok(!std.equivalent(1n, 0));
	assert.ok(!std.equivalent(1n, 1));
	// symbol
	assert.ok(std.equivalent(Symbol('abc'), Symbol('abc')));
	assert.ok(!std.equivalent(Symbol(0), Symbol('foo')));
	// null/undefined
	assert.ok(std.equivalent(null, null));
	assert.ok(std.equivalent(undefined, undefined));
	assert.ok(!std.equivalent(null, undefined));
	assert.ok(!std.equivalent(undefined, 0));
	assert.ok(!std.equivalent(undefined, ''));
	// function - true for any function comparison
	assert.ok(
		std.equivalent(
			() => {},
			() => {}
		)
	);
	assert.ok(
		std.equivalent(
			() => '',
			() => 0
		)
	);
});
basics.equivalent('equivalent array checks', () => {
	assert.ok(std.equivalent([], []));
	assert.ok(std.equivalent(['', 1, !0], ['', 1, !0]));
	assert.ok(std.equivalent([{ x: [] }], [{ x: [] }]));
});
basics.equivalent('equivalent object checks', () => {
	assert.ok(std.equivalent({}, {}));
	assert.ok(std.equivalent({ a: '', b: 1, c: !0 }, { a: '', b: 1, c: !0 }));
	assert.ok(std.equivalent({ x: [{}], y: { a: 0 } }, { x: [{}], y: { a: 0 } }));
});

Object.values(basics).forEach((v) => v.run());
