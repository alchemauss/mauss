import * as compare from './index.js';

let maybe: boolean = false;
let generic: Record<any, any> = {};
let unknown: Record<any, unknown> = {};

compare.key('name')(generic, generic);
compare.key('name')(unknown, unknown);
compare.key('name')({ name: 'abc' }, { name: 'def', foo: maybe ? 1 : undefined });
compare.key('name', compare.string)({ name: 'abc' }, { name: 'def' });
compare.key('name.first', compare.string)(
	{ name: { first: 'abc-xyz' } },
	{ name: { first: 'xyz-def' } }
);
compare.key('date.updated', compare.date)(
	{ id: '', date: { updated: new Date() } },
	{ id: '', date: { updated: new Date() } }
);
compare.key('date.pub.note')(
	{ date: { pub: { note: 'yay' } } },
	{ date: { pub: { note: 'yay' } } }
);

interface Example {
	name: string;
	date: {
		updated: Date;
		published: Date;
	};
}
compare.key<Example>('date.updated');

// ---- errors ----

// @ts-expect-error
compare.key(1);
// @ts-expect-error
compare.key(Symbol(''));
// @ts-expect-error
compare.key('name')({}, { name: 'abc' });
// @ts-expect-error
compare.key('name')({ name: 'abc' }, {});
// @ts-expect-error
compare.key('name.last')({ name: { first: 'abc' } }, { name: { first: 'def' } });
// @ts-expect-error
compare.key('nope')({ name: 'abc' }, { name: 'def' });
// @ts-expect-error
compare.key('date.pub')({ date: '' }, { date: '' });
// @ts-expect-error
compare.key<Example>('');
// @ts-expect-error
compare.key<Example>('date.updated.valueOf');
