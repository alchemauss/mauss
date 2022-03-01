import { suite } from 'uvu';
import assert from 'uvu/assert';
import * as guards from '.';

// checked based on https://developer.mozilla.org/en-US/docs/Glossary/Falsy
const data = [true, false, 'a', 'b', 0, 1, 2, '', null, undefined, NaN];
const numbers = [-2, -1, 0, 1, 2, 3];

const basic = suite('guards');

basic('filters values that exists', () => {
	const filtered = data.filter(guards.exists);
	assert.equal(filtered, [true, false, 'a', 'b', 0, 1, 2, NaN]);
});

basic('filters values that are nullish', () => {
	const filtered = data.filter(guards.nullish);
	assert.equal(filtered, [null, undefined]);
});

basic('filters values that are truthy', () => {
	const filtered = data.filter(guards.truthy);
	assert.equal(filtered, [true, 'a', 'b', 1, 2]);
});

basic('filters numbers that are natural', () => {
	const filtered = numbers.filter(guards.natural);
	assert.equal(filtered, [1, 2, 3]);
});

basic('filters numbers that are whole', () => {
	const filtered = numbers.filter(guards.whole);
	assert.equal(filtered, [0, 1, 2, 3]);
});

basic.run();

// --- not() suite ---

const inverse = suite('not(guards)');

inverse('filters values that does not exists', () => {
	const filtered = data.filter(guards.not(guards.exists));
	assert.equal(filtered, ['', null, undefined]);
});

inverse('filters values that are not nullish', () => {
	const filtered = data.filter(guards.not(guards.nullish));
	assert.equal(filtered, [true, false, 'a', 'b', 0, 1, 2, '', NaN]);
});

inverse('filters values that are falsy', () => {
	const filtered = data.filter(guards.not(guards.truthy));
	assert.equal(filtered, [false, 0, '', null, undefined, NaN]);
});

inverse('filters numbers that are not natural', () => {
	const filtered = numbers.filter(guards.not(guards.natural));
	assert.equal(filtered, [-2, -1, 0]);
});

inverse('filters numbers that are not whole', () => {
	const filtered = numbers.filter(guards.not(guards.whole));
	assert.equal(filtered, [-2, -1]);
});

inverse.run();
