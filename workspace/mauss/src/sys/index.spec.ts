import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as sys from './index.js';

const suites = {
	'path/catenate': suite('path/catenate'),
};

suites['path/catenate']('joins paths base cases', () => {
	assert.equal(sys.catenate(), '.');
	assert.equal(sys.catenate(''), '.');
	assert.equal(sys.catenate('/'), '/');
});

suites['path/catenate']('joins URL-like paths correctly', () => {
	assert.equal(sys.catenate('/', 'root', ':id'), '/root/:id');
	assert.equal(sys.catenate('relative', ':id'), 'relative/:id');
	assert.equal(sys.catenate('/', '/', '/', '/foo/', '/', ':id'), '/foo/:id');
	assert.equal(sys.catenate('', '', '', 'foo', '', ':id'), 'foo/:id');
});

suites['path/catenate']('joins file-like paths correctly', () => {
	assert.equal(sys.catenate('/root', './user'), '/root/user');
	assert.equal(sys.catenate('/root/usr/', '..'), '/root');
	assert.equal(sys.catenate('/mnt/srv', './usr/../backup'), '/mnt/srv/backup');
	assert.equal(sys.catenate('../usr', './backup'), '../usr/backup');
});

Object.values(suites).forEach((v) => v.run());
