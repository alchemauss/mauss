import { suite } from 'uvu';
import assert from 'uvu/assert';
import * as set from './set';

const basics = [suite('permutation')];

basics[0]('returns array with empty array for empty array', () => {
	assert.equal(set.permutation([]), [[]]);
});
basics[0]('returns immediate wrapped input for one length array', () => {
	assert.equal(set.permutation(['a']), [['a']]);
});
basics[0]('correctly permute 2 words and returns array of results', () => {
	assert.equal(set.permutation(['a', 'b']), [
		['a', 'b'],
		['b', 'a'],
	]);
});
basics[0]('correctly permute 3 words and returns array of results', () => {
	assert.equal(set.permutation(['a', 'b', 'c']), [
		['a', 'b', 'c'],
		['a', 'c', 'b'],
		['b', 'a', 'c'],
		['b', 'c', 'a'],
		['c', 'a', 'b'],
		['c', 'b', 'a'],
	]);
});
basics[0]('correctly permute 4 words and returns array of results', () => {
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

basics.forEach((v) => v.run());

// --- mutated suite ---

const advanced = [suite('permutation+fn')];

const dashed = (i: string[]) => i.join('-');
advanced[0]('returns array with empty string for empty array', () => {
	assert.equal(set.permutation([], dashed), ['']);
});
advanced[0]('returns immediate input for one length array', () => {
	assert.equal(set.permutation(['a'], dashed), ['a']);
});
advanced[0]('correctly permute and mutate 2 words', () => {
	assert.equal(set.permutation(['a', 'b'], dashed), ['a-b', 'b-a']);
});
advanced[0]('correctly permute and mutate 3 words', () => {
	assert.equal(set.permutation(['a', 'b', 'c'], dashed), [
		'a-b-c',
		'a-c-b',
		'b-a-c',
		'b-c-a',
		'c-a-b',
		'c-b-a',
	]);
});
advanced[0]('correctly permute and mutate 4 words', () => {
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

advanced.forEach((v) => v.run());
