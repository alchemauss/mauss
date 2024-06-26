import { entries } from './object.js';

entries<{}>({});

// ---- errors ----

// @ts-expect-error - error on empty argument
entries();
// @ts-expect-error - error on non-object type
entries(null);
