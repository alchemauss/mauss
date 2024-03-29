import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as dt from './index.js';

const suites = {
	'build/': suite('temporal/build'),
	'format/': suite('temporal/format'),
	'travel/': suite('temporal/travel'),
};

const fixed = new Date('2017/09/08, 13:02:03');

suites['build/']('basic formatter builder', () => {
	const format = dt.build({ base: 'UTC' });

	assert.type(format, 'function');

	const renderer = format(fixed);

	assert.equal(renderer('DD/MM/YYYY (Z)'), '08/09/2017 (+0)');
});

suites['format/']('basic rendering', () => {
	const renderer = dt.format(fixed);

	assert.equal(renderer('foo'), 'foo');

	assert.equal(renderer('D'), '8');
	assert.equal(renderer('DD'), '08');
	assert.equal(renderer('DDD'), 'Fri');
	assert.equal(renderer('DDDD'), 'Friday');
	assert.equal(renderer('M'), '9');
	assert.equal(renderer('MM'), '09');
	assert.equal(renderer('MMM'), 'Sep');
	assert.equal(renderer('MMMM'), 'September');
	assert.equal(renderer('YY'), '17');
	assert.equal(renderer('YYYY'), '2017');
	assert.equal(renderer('H'), '13');
	assert.equal(renderer('HH'), '13');
	assert.equal(renderer('h'), '1');
	assert.equal(renderer('hh'), '01');
	assert.equal(renderer('m'), '2');
	assert.equal(renderer('mm'), '02');
	assert.equal(renderer('s'), '3');
	assert.equal(renderer('ss'), '03');

	assert.equal(renderer('DD/MM/YYYY!'), '08/09/2017!');

	assert.equal(
		`Valid from: [${renderer('YYYY-MM-DD ~ HH:mm:ss')}]`,
		'Valid from: [2017-09-08 ~ 13:02:03]',
	);
});
suites['format/']('throw on invalid date', () => {
	assert.throws(() => dt.format('invalid'));
});

Object.values(suites).forEach((v) => v.run());
