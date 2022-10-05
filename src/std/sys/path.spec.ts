import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as path from './path.js';

const basics = {
	join: suite('path:join'),
};

basics.join('joins paths base cases', () => {
	assert.equal(path.join(''), '');
	assert.equal(path.join('/'), '/');
});

basics.join('joins URL-like paths correctly', () => {
	assert.equal(path.join('/', 'root', ':id'), '/root/:id');
	assert.equal(path.join('/root', ':id'), '/root/:id');
	assert.equal(path.join('relative', ':id'), 'relative/:id');
	assert.equal(path.join('/', '/', '/', '/foo/', '/', ':id'), '/foo/:id');
	assert.equal(path.join('', '', '', 'foo', '', ':id'), 'foo/:id');
});

basics.join('joins file-like paths correctly', () => {
	assert.equal(path.join('/root', './user'), '/root/user');
	assert.equal(path.join('/root/usr/', '..'), '/root');
	assert.equal(path.join('/mnt/srv', './usr/../backup'), '/mnt/srv/backup');
	assert.equal(path.join('../usr', './backup'), '../usr/backup');
});

Object.values(basics).forEach((v) => v.run());
