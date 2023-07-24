import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import * as ntv from './array.js';

const suites = {
	'arr/zip': suite('arr/zip'),
};

suites['arr/zip']('zip multiple arrays of objects', () => {
	const zipped = ntv.zip(
		[{ a: 0 }, { x: 0 }],
		[{ b: 0 }, { y: 0 }],
		[{ c: 0 }, { z: 0 }],
		[{ d: 0 }, { x: 1 }],
	);

	assert.equal(zipped, [
		{ a: 0, b: 0, c: 0, d: 0 },
		{ x: 1, y: 0, z: 0 },
	]);
});
suites['arr/zip']('zip multiple uneven arrays', () => {
	const zipped = ntv.zip(
		[{ a: 0 }],
		[{ a: 1 }, { x: 0 }],
		[{ b: 0 }, { y: 0 }],
		[{ c: 0 }, { z: 0 }, { v: 0 }],
		[{ d: 0 }, { x: 1 }],
		[null, null, { w: 0 }, { w: 0 }],
		[null, null, { x: 0 }, { x: 0 }],
		[null, null, { v: 1 }, { y: 0 }],
	);

	assert.equal(zipped, [
		{ a: 1, b: 0, c: 0, d: 0 },
		{ x: 1, y: 0, z: 0 },
		{ v: 1, w: 0, x: 0 },
		{ w: 0, x: 0, y: 0 },
	]);
});
suites['arr/zip']('zip remove all nullish index', () => {
	const zipped = ntv.zip(
		[{ a: 0 }, null, { x: 0 }, null, { a: 0 }, undefined],
		[{ b: 0 }, null, { y: 0 }, undefined, { b: 0 }, null],
		[{ c: 0 }, null, { z: 0 }, undefined, { c: 0 }, null],
		[{ d: 0 }, null, { x: 1 }, null, { d: 0 }, undefined],
	);

	assert.equal(zipped, [
		{ a: 0, b: 0, c: 0, d: 0 },
		{ x: 1, y: 0, z: 0 },
		{ a: 0, b: 0, c: 0, d: 0 },
	]);
});

Object.values(suites).forEach((v) => v.run());
