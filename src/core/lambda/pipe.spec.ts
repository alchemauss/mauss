import { test } from 'uvu';
import assert from 'uvu/assert';
import { pipe } from './pipe';

const name = <T extends { name: string }>(v: T) => v.name;
const cap = (v: string) => v.toUpperCase();
const split = (v: string) => v.split('');

test('properly apply functions in ltr order', () => {
	const pipeline = pipe(name, cap, split);
	assert.equal(pipeline({ name: 'mom' }), ['M', 'O', 'M']);
});

test.run();
