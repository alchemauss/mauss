import { tsf } from './index.js';

tsf('');
tsf('/');
tsf('/')({});
tsf('/{?qs}')({});
tsf('/{foo}')({ foo: (v) => v });
tsf('/{foo}/{bar}')({ foo: 'hello', bar: () => 'world' });
tsf('/{foo}/{bar}')({ foo: (v) => v, bar: (v) => v });
tsf('/{v}/api/users{?qs}')({ v: 'v1' });
tsf('/{foo}')({ foo: (v) => v.length > 1 && v.replace('o', 'u') });
tsf('' as string)({ boo: (v) => v }); // index signature fallback
tsf('' as `${string}/v1/posts/{id}/comments`)({ id: (v) => v });

// ---- errors ----

// @ts-expect-error
tsf('{}');
// @ts-expect-error
tsf('/{}');
// @ts-expect-error
tsf('{}/');
// @ts-expect-error
tsf('/{{}}');
// @ts-expect-error
tsf('/{}}');
// @ts-expect-error
tsf('/{{}');
// @ts-expect-error
tsf('/{{}{');
// @ts-expect-error
tsf('/{{foo}}');
// @ts-expect-error
tsf('/{{foo}{');
// @ts-expect-error
tsf('/{}/{bar}');
// @ts-expect-error
tsf('/{foo}/{{}}');

// @ts-expect-error
tsf('/')();
// @ts-expect-error
tsf('/{foo}')();
// @ts-expect-error
tsf('/{foo}/{bar}')({});
// @ts-expect-error
tsf('/{foo}/{bar}')({ foo: (v) => v });
// @ts-expect-error
tsf('/{foo}')({ foo: (v) => v, bar: (v) => v });
// @ts-expect-error
tsf('' as `${string}/v1/posts/{id}/comments`)({});

tsf('{hello-world}')({ 'hello-world': (v) => v });
