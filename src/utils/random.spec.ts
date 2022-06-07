import { suite } from 'uvu';
import assert from 'uvu/assert';
import * as random from './random';

const basics = {
	float: suite('random:float'),
	int: suite('random:int'),
	bool: suite('random:bool'),
	array: suite('random:array'),
	key: suite('random:key'),
	val: suite('random:val'),
	// hex: suite('random:hex'),
	// ipv4: suite('random:ipv4'),
};

// ---- standard ----

basics.float('generate random float', () => {
	const number = random.float();
	assert.type(number, 'number');
	assert.ok(number >= 0 && number <= 1);
});
basics.int('generate random integer', () => {
	const number = random.int();
	assert.type(number, 'number');
	assert.ok(number === 0 || number === 1);
});
basics.bool('generate random bool', () => {
	assert.type(random.bool(), 'boolean');
});
basics.array('generate array with random values', () => {
	const array = random.array(5, 3);
	assert.type(array, 'object');
	assert.equal(array.length, 5);
});
basics.key('get random key from object', () => {
	const key = random.key({ foo: 0, bar: 1 });
	assert.type(key, 'string');
	assert.ok(key === 'foo' || key === 'bar');
});
basics.val('get random value from object', () => {
	const val = random.val({ foo: 0, bar: 1 });
	assert.type(val, 'number');
	assert.ok(val === 0 || val === 1);
});

Object.values(basics).forEach((v) => v.run());