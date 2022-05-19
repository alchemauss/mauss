import { compare } from './inspector';

let maybe: boolean = false;
let generic: Record<any, any> = {};
let unknown: Record<any, unknown> = {};

compare.key('name')(generic, generic);
compare.key('name')({ name: 'abc' }, { name: 'def', foo: maybe ? 1 : undefined });

// ---- errors ----

// @ts-expect-error
compare.key('name')(unknown, unknown);
// @ts-expect-error
compare.key('name')({}, { name: 'abc' });
// @ts-expect-error
compare.key('name')({ name: 'abc' }, {});
// @ts-expect-error
compare.key('nope')({ name: 'abc' }, { name: 'def' });
