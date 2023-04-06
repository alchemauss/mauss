import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as lambda from './index.js';

const basics = {
	curry: suite('lambda:curry'),
	pipe: suite('lambda:pipe'),
};

const composite = {
	masked: suite('lambda:mask+reveal'),
};

basics.curry('properly curry a function', () => {
	const sum = (a: number, b: number, c: number) => a + b + c;
	const curried = lambda.curry(sum);

	assert.type(curried, 'function');
	assert.type(curried(1), 'function');
	assert.type(curried(1)(1), 'function');
	assert.type(curried(1)(1)(1), 'number');
	assert.equal(curried(1)(1)(1), 3);
});

basics.pipe('properly apply functions in ltr order', () => {
	const cap = (v: string) => v.toUpperCase();
	const name = <T extends { name: string }>(v: T) => v.name;
	const split = (v: string) => v.split('');

	const pipeline = lambda.pipe(name, cap, split);
	assert.equal(pipeline({ name: 'mom' }), ['M', 'O', 'M']);
});

Object.values(basics).forEach((v) => v.run());

// ---- composite ----

composite.masked('properly mask and reveal a value', () => {
	const { mask, reveal } = lambda;

	const answer = mask.of(() => 42);
	assert.equal(reveal(answer).expect('unreachable'), 42);

	let maybe: string | null | undefined;
	let wrapped = mask.wrap(maybe);
	assert.equal(reveal(wrapped).or('2023-04-04'), '2023-04-04');

	wrapped = mask.wrap('2023-04-06');
	assert.equal(reveal(wrapped).expect('unreachable'), '2023-04-06');
});

Object.values(composite).forEach((v) => v.run());
