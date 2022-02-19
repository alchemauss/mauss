import { suite } from 'uvu';
import assert from 'uvu/assert';
import * as set from './set';

const basic = suite('basic');

basic('returns array with empty array for empty array', () => {
	assert.equal(set.permutation([]), [[]]);
});
basic('returns immediate wrapped input for one length array', () => {
	assert.equal(set.permutation(['a']), [['a']]);
});
basic('correctly permute 2 words and returns array of results', () => {
	assert.equal(set.permutation(['a', 'b']), [
		['a', 'b'],
		['b', 'a'],
	]);
});
basic('correctly permute 3 words and returns array of results', () => {
	assert.equal(set.permutation(['a', 'b', 'c']), [
		['a', 'b', 'c'],
		['a', 'c', 'b'],
		['b', 'a', 'c'],
		['b', 'c', 'a'],
		['c', 'a', 'b'],
		['c', 'b', 'a'],
	]);
});
basic('correctly permute 4 words and returns array of results', () => {
	assert.equal(set.permutation(['a', 'b', 'c', 'd']), [
		['a', 'b', 'c', 'd'],
		['a', 'b', 'd', 'c'],
		['a', 'c', 'b', 'd'],
		['a', 'c', 'd', 'b'],
		['a', 'd', 'b', 'c'],
		['a', 'd', 'c', 'b'],
		['b', 'a', 'c', 'd'],
		['b', 'a', 'd', 'c'],
		['b', 'c', 'a', 'd'],
		['b', 'c', 'd', 'a'],
		['b', 'd', 'a', 'c'],
		['b', 'd', 'c', 'a'],
		['c', 'a', 'b', 'd'],
		['c', 'a', 'd', 'b'],
		['c', 'b', 'a', 'd'],
		['c', 'b', 'd', 'a'],
		['c', 'd', 'a', 'b'],
		['c', 'd', 'b', 'a'],
		['d', 'a', 'b', 'c'],
		['d', 'a', 'c', 'b'],
		['d', 'b', 'a', 'c'],
		['d', 'b', 'c', 'a'],
		['d', 'c', 'a', 'b'],
		['d', 'c', 'b', 'a'],
	]);
});

basic.run();

// --- mutated suite ---

const mutated = suite('mutated');

const dashed = (i: string[]) => i.join('-');
mutated('returns array with empty string for empty array', () => {
	assert.equal(set.permutation([], dashed), ['']);
});
mutated('returns immediate input for one length array', () => {
	assert.equal(set.permutation(['a'], dashed), ['a']);
});
mutated('correctly permute and mutate 2 words', () => {
	assert.equal(set.permutation(['a', 'b'], dashed), ['a-b', 'b-a']);
});
mutated('correctly permute and mutate 3 words', () => {
	assert.equal(set.permutation(['a', 'b', 'c'], dashed), [
		'a-b-c',
		'a-c-b',
		'b-a-c',
		'b-c-a',
		'c-a-b',
		'c-b-a',
	]);
});
mutated('correctly permute and mutate 4 words', () => {
	assert.equal(set.permutation(['a', 'b', 'c', 'd'], dashed), [
		'a-b-c-d',
		'a-b-d-c',
		'a-c-b-d',
		'a-c-d-b',
		'a-d-b-c',
		'a-d-c-b',
		'b-a-c-d',
		'b-a-d-c',
		'b-c-a-d',
		'b-c-d-a',
		'b-d-a-c',
		'b-d-c-a',
		'c-a-b-d',
		'c-a-d-b',
		'c-b-a-d',
		'c-b-d-a',
		'c-d-a-b',
		'c-d-b-a',
		'd-a-b-c',
		'd-a-c-b',
		'd-b-a-c',
		'd-b-c-a',
		'd-c-a-b',
		'd-c-b-a',
	]);
});

mutated.run();
