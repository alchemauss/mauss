import * as main from '../../index';

describe('permutation', () => {
	it('returns array with empty array for empty array', () => {
		expect(main.permutation([])).toStrictEqual([[]]);
	});
	it('returns immediate wrapped input for one length array', () => {
		expect(main.permutation(['a'])).toStrictEqual([['a']]);
	});
	it('correctly permute 2 words and returns array of results', () => {
		expect(main.permutation(['a', 'b'])).toStrictEqual([
			['a', 'b'],
			['b', 'a'],
		]);
	});
	it('correctly permute 3 words and returns array of results', () => {
		expect(main.permutation(['a', 'b', 'c'])).toStrictEqual([
			['a', 'b', 'c'],
			['a', 'c', 'b'],
			['b', 'a', 'c'],
			['b', 'c', 'a'],
			['c', 'a', 'b'],
			['c', 'b', 'a'],
		]);
	});
	it('correctly permute 4 words and returns array of results', () => {
		expect(main.permutation(['a', 'b', 'c', 'd'])).toStrictEqual([
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
	describe('mutated', () => {
		const toDashed = (i: string[]) => i.join('-');
		it('returns array with empty string for empty array', () => {
			expect(main.permutation([], toDashed)).toStrictEqual(['']);
		});
		it('returns immediate input for one length array', () => {
			expect(main.permutation(['a'], toDashed)).toStrictEqual(['a']);
		});
		it('correctly permute and mutate 2 words', () => {
			expect(main.permutation(['a', 'b'], toDashed)).toStrictEqual(['a-b', 'b-a']);
		});
		it('correctly permute and mutate 3 words', () => {
			expect(main.permutation(['a', 'b', 'c'], toDashed)).toStrictEqual([
				'a-b-c',
				'a-c-b',
				'b-a-c',
				'b-c-a',
				'c-a-b',
				'c-b-a',
			]);
		});
		it('correctly permute and mutate 4 words', () => {
			expect(main.permutation(['a', 'b', 'c', 'd'], toDashed)).toStrictEqual([
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
	});
});
