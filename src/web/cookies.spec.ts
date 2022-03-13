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

// basics.create('generate Set-Cookie value', () => {
// 	const set = cookies.create('foo', 'bar', { expires: 0 });
// 	const now = new Date().toUTCString();
// 	assert.equal(set, `foo=bar; Expires=${now}; Path=/; SameSite=Lax; HttpOnly`);
// });

Object.values(basics).forEach((v) => v.run());
