import { compare } from './inspector';

let maybe: boolean;

compare.key('name')({ name: 'abc' }, { name: 'def', foo: maybe ? 1 : undefined });

// ---- errors ----

// @ts-expect-error
compare.key('name')({}, { name: 'abc' });
// @ts-expect-error
compare.key('name')({ name: 'abc' }, {});
// @ts-expect-error
compare.key('nope')({ name: 'abc' }, { name: 'def' });
