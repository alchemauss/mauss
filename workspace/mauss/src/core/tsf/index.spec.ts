import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { tsf } from './index.js';

test.skip('throws on nested braces', () => {
	assert.throws(() => tsf('/{foo/{bar}}' as string));
	assert.throws(() => tsf('/{nested-{}-braces}' as string));
});

test('parses template without braces', () => {
	assert.equal(tsf('')({}), '');
	assert.equal(tsf('/')({}), '/');
	assert.equal(tsf('/foo')({}), '/foo');
});

test('parses template correctly', () => {
	const r1 = tsf('/{foo}/{bar}');

	assert.equal(
		r1({
			foo: 'hello',
			bar: 'world',
		}),
		'/hello/world',
	);
	assert.equal(
		r1({
			foo: (v) => v,
			bar: (v) => v,
		}),
		'/foo/bar',
	);
	assert.equal(
		r1({
			foo: (v) => [...v].reverse().join(''),
			bar: (v) => [...v].reverse().join(''),
		}),
		'/oof/rab',
	);
});

test('parses template with optional parameters', () => {
	const r = tsf('/{v}/api/users{?qs}');
	assert.equal(r({ v: 'v1' }), '/v1/api/users');
	assert.equal(r({ v: 'v1', '?qs': '?foo=bar' }), '/v1/api/users?foo=bar');
	assert.equal(r({ v: 'v1', '?qs': (v) => !v && `?${v}` }), '/v1/api/users');
});

test.skip('parses template with nested braces', () => {
	const r1 = tsf('/{foo/{bar}}' as string);
	assert.equal(r1({ 'foo/{bar}': (v) => v }), '/foo/{bar}');

	const r2 = tsf('/{nested-{}-braces}' as string);
	assert.equal(r2({ 'nested-{}-braces': (v) => v }), '/nested-{}-braces');
});

test.run();
