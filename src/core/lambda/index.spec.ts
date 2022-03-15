import { suite } from 'uvu';
import assert from 'uvu/assert';

import curry from './curry';
import pipe from './pipe';

const basics = {
	curry: suite('lambda:curry'),
	pipe: suite('lambda:pipe'),
};

basics.curry('properly curry a function', () => {
	const sum = (a: number, b: number, c: number) => a + b + c;
	const curried = curry(sum);

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

	const pipeline = pipe(name, cap, split);
	assert.equal(pipeline({ name: 'mom' }), ['M', 'O', 'M']);
});

Object.values(basics).forEach((v) => v.run());