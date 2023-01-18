import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import unique from './unique.js';

const basics = {
	simple: suite('unique:simple'),
	object: suite('unique:object'),
};

basics.simple('make array items unique', () => {
	assert.equal(unique([true, false, !0, !1]), [true, false]);
	assert.equal(unique([1, 1, 2, 3, 2, 4, 5]), [1, 2, 3, 4, 5]);
	assert.equal(unique(['a', 'a', 'b', 'c', 'b']), ['a', 'b', 'c']);

	const months = ['jan', 'feb', 'mar'] as const;
	assert.equal(unique(months), ['jan', 'feb', 'mar']);
});

basics.object('make array of object unique', () => {
	assert.equal(
		unique(
			[
				{ id: 'ab', name: 'A' },
				{ id: 'cd' },
				{ id: 'ef', name: 'B' },
				{ id: 'ab', name: 'C' },
				{ id: 'ef', name: 'D' },
			],
			'id'
		),
		[{ id: 'ab', name: 'A' }, { id: 'cd' }, { id: 'ef', name: 'B' }]
	);

	assert.equal(
		unique(
			[
				{ id: 'ab', name: { first: 'A' } },
				{ id: 'cd', name: { first: 'B' } },
				{ id: 'ef', name: { first: 'B' } },
				{ id: 'ab', name: { first: 'C' } },
				{ id: 'ef', name: { first: 'D' } },
				{ id: 'hi', name: { last: 'wa' } },
			],
			'name.first'
		),
		[
			{ id: 'ab', name: { first: 'A' } },
			{ id: 'cd', name: { first: 'B' } },
			{ id: 'ab', name: { first: 'C' } },
			{ id: 'ef', name: { first: 'D' } },
		]
	);
});

Object.values(basics).forEach((v) => v.run());
