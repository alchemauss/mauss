import { augment } from './index.js';

augment<{}>({});

// ---- errors ----

// @ts-expect-error - error on empty argument
augment();
// @ts-expect-error - error on non-object type
augment(null);
