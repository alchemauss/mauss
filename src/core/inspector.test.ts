import { compare } from './inspector.js';

let maybe: boolean = false;
let generic: Record<any, any> = {};
let unknown: Record<any, unknown> = {};

compare.key('name')(generic, generic);
compare.key('name')({ name: 'abc' }, { name: 'def', foo: maybe ? 1 : undefined });
compare.key('name', compare.string)({ name: 'abc' }, { name: 'def' });
compare.key('name.first', compare.string)({ name: { first: 'abc' } }, { name: { first: 'def' } });

// ---- errors ----

// @ts-expect-error
compare.key('name')(unknown, unknown);
// @ts-expect-error
compare.key('name')({}, { name: 'abc' });
// @ts-expect-error
compare.key('name')({ name: 'abc' }, {});
// @ts-expect-error
compare.key('name.last')({ name: { first: 'abc' } }, { name: { first: 'def' } });
// @ts-expect-error
compare.key('nope')({ name: 'abc' }, { name: 'def' });
