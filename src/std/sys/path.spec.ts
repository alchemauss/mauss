import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as path from './path.js';

test('joins paths correctly', () => {
	assert.equal(path.join(''), '');
	assert.equal(path.join('/'), '/');
	assert.equal(path.join('/', 'root', ':id'), '/root/:id');
	assert.equal(path.join('/root', ':id'), '/root/:id');
	assert.equal(path.join('relative', ':id'), 'relative/:id');
	assert.equal(path.join('/', '/', '/', '/foo/', '/', ':id'), '/foo/:id');
	assert.equal(path.join('', '', '', 'foo', '', ':id'), 'foo/:id');
});

test.run();
