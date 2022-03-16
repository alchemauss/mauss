import { suite } from 'uvu';
import assert from 'uvu/assert';
import * as cookies from './cookies';

const basics = {
	parse: suite('cookie:parse'),
	create: suite('cookie:create'),
	remove: suite('cookie:remove'),
	bulk: suite('cookie:bulk'),
	raw: suite('cookie:raw'),
};

// ---- parse ----

basics.parse('parse basic input', () => {
	const jar = cookies.parse('foo=bar;hi=mom;hello=world');
	assert.equal(jar.get('foo'), 'bar');
	assert.equal(jar.get('hi'), 'mom');
	assert.equal(jar.get('hello'), 'world');
});
basics.parse('parse ignore spaces', () => {
	const jar = cookies.parse('foo   = bar;  hi=     mom');
	assert.equal(jar.get('foo'), 'bar');
	assert.equal(jar.get('hi'), 'mom');
});
basics.parse('parse handle quoted', () => {
	const jar = cookies.parse('foo="bar=123&hi=mom"');
	assert.equal(jar.get('foo'), 'bar=123&hi=mom');
});
basics.parse('parse escaped values', () => {
	const jar = cookies.parse('foo=%20%22%2c%2f%3b');
	assert.equal(jar.get('foo'), ' ",/;');
});
basics.parse('parse ignore errors', () => {
	const jar = cookies.parse('foo=%1;bar=baz;huh;');
	assert.equal(jar.get('foo'), '%1');
	assert.equal(jar.get('bar'), 'baz');
	assert.ok(!jar.has('huh'));
});
basics.parse('parse ignore missing values', () => {
	const jar = cookies.parse('foo=;bar= ;huh');
	assert.ok(!jar.has('foo'));
	assert.ok(!jar.has('bar'));
	assert.ok(!jar.has('huh'));
});

// ---- create ----

basics.create('generate Set-Cookie value to set cookie', () => {
	const value = cookies.create('foo', 'bar');
	assert.match(value, /foo=bar; Expires=(.*); Path=\/; SameSite=Lax; HttpOnly/);
});

// ---- remove ----

basics.remove('generate Set-Cookie value to remove cookie', () => {
	const value = cookies.remove('foo');
	assert.match(value, /foo=; Path=\/; Expires=Thu, 01 Jan 1970 00:00:01 GMT/);
});

// ---- bulk ----

basics.bulk('bulk generate Set-Cookie values', () => {
	const data = { foo: 'bar' };
	for (const value of cookies.bulk(data)) {
		assert.match(value, /(.*)=(.*); Expires=(.*); Path=\/; SameSite=Lax; HttpOnly/);
	}
});

// ---- raw ----

basics.raw('raw basic input', () => {
	const header = 'foo=bar;hi=mom;hello=world';
	assert.equal(cookies.raw(header, 'foo'), 'bar');
	assert.equal(cookies.raw(header, 'hi'), 'mom');
	assert.equal(cookies.raw(header, 'hello'), 'world');
});
basics.raw('raw ignore spaces', () => {
	const header = 'foo   = bar;  hi=  mom';
	assert.equal(cookies.raw(header, 'foo'), ' bar');
	assert.equal(cookies.raw(header, 'hi'), '  mom');
});
basics.raw('raw handle quoted', () => {
	const header = 'foo="bar=123&hi=mom"';
	assert.equal(cookies.raw(header, 'foo'), '"bar=123&hi=mom"');
});
basics.raw('raw escaped values', () => {
	const header = 'foo=%20%22%2c%2f%3b';
	assert.equal(cookies.raw(header, 'foo'), '%20%22%2c%2f%3b');
});
basics.raw('raw return empty values', () => {
	const header = 'foo=;bar= ;huh';
	assert.ok(!cookies.raw(header, 'foo'));
	assert.ok(cookies.raw(header, 'bar'));
	assert.ok(!cookies.raw(header, 'huh'));
});

Object.values(basics).forEach((v) => v.run());
