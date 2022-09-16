import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { read } from './csv.js';

test('parse csv edge cases correctly', () => {
	const parsed = read(
		'"1st col","2 w/ escaped """" double quotes""","3, w/, commas",4 w/ no quotes,"5 w/ CRLF\r\n"\r\n"1st col","2 w/ escaped """" double quotes""","3, w/, commas",4 w/ no quotes,"5 w/ CRLF\r\n"'
	);

	const json = [
		[
			'1st col',
			'2 w/ escaped "" double quotes"',
			'3, w/, commas',
			'4 w/ no quotes',
			'5 w/ CRLF\r\n',
		],
		[
			'1st col',
			'2 w/ escaped "" double quotes"',
			'3, w/, commas',
			'4 w/ no quotes',
			'5 w/ CRLF\r\n',
		],
	];

	assert.equal(parsed, json);
});

test.run();
