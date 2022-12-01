import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as std from './index.js';

const basics = {
	identical: suite('std:identical'),
};

basics.identical('identical primitive checks', () => {
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
			() => {}
		)
	);
	assert.ok(
		std.identical(
			() => '',
			() => 0
		)
	);
});
basics.identical('identical array checks', () => {
	assert.ok(std.identical([], []));
	assert.ok(std.identical(['', 1, !0], ['', 1, !0]));
	assert.ok(std.identical([{ x: [] }], [{ x: [] }]));
	assert.ok(!std.identical(['', 0, !0], ['', 1, !1]));
	assert.ok(!std.identical([{ x: [] }], [{ y: [] }]));
});
basics.identical('identical object checks', () => {
	assert.ok(std.identical({}, {}));
	assert.ok(std.identical({ a: '', b: 1, c: !0 }, { a: '', b: 1, c: !0 }));
	assert.ok(std.identical({ x: [{}], y: { a: 0 } }, { x: [{}], y: { a: 0 } }));
});

Object.values(basics).forEach((v) => v.run());
