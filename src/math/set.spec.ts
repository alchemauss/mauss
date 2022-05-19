import { suite } from 'uvu';
import assert from 'uvu/assert';
import * as set from './set';

const basics = {
	permutation: suite('permutation'),
};

basics.permutation('returns array with empty array for empty array', () => {
	assert.equal(set.permutation([]), [[]]);
});
basics.permutation('returns immediate wrapped input for one length array', () => {
	assert.equal(set.permutation(['a']), [['a']]);
});
basics.permutation('correctly permute 2 words and returns array of results', () => {
	assert.equal(set.permutation(['a', 'b']), [
		['a', 'b'],
		['b', 'a'],
	]);
});
basics.permutation('correctly permute 3 words and returns array of results', () => {
	assert.equal(set.permutation(['a', 'b', 'c']), [
		['a', 'b', 'c'],
		['a', 'c', 'b'],
		['b', 'a', 'c'],
		['b', 'c', 'a'],
		['c', 'a', 'b'],
		['c', 'b', 'a'],
	]);
});
basics.permutation('correctly permute 4 words and returns array of results', () => {
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

// ---- mutated suite ----

const advanced = {
	permutation: suite('permutation+'),
};

const dashed = (i: string[]) => i.join('-');
advanced.permutation('returns array with empty string for empty array', () => {
	assert.equal(set.permutation([], dashed), ['']);
});
advanced.permutation('returns immediate input for one length array', () => {
	assert.equal(set.permutation(['a'], dashed), ['a']);
});
advanced.permutation('correctly permute and mutate 2 words', () => {
	assert.equal(set.permutation(['a', 'b'], dashed), ['a-b', 'b-a']);
});
advanced.permutation('correctly permute and mutate 3 words', () => {
	assert.equal(set.permutation(['a', 'b', 'c'], dashed), [
		'a-b-c',
		'a-c-b',
		'b-a-c',
		'b-c-a',
		'c-a-b',
		'c-b-a',
	]);
});
advanced.permutation('correctly permute and mutate 4 words', () => {
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

Object.values(basics).forEach((v) => v.run());
Object.values(advanced).forEach((v) => v.run());
