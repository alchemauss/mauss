/* <-- Basic Typing Aliases --> */

/** Nullish values, which are only `null` and `undefined` */
export type Nullish = null | undefined;

/** Falsy values, value considered false in boolean context */
export type Falsy = false | 0 | '' | Nullish;

/** Basic primitives consisting of `string`, `number`, and `boolean` */
export type Primitives = string | number | boolean;

/** Primitives from `typeof` as their actual type */
export type FullPrimitives = Primitives | bigint | symbol;

/** Primitive values from `typeof` as string union */
export type TypePrimitive = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol';

/** The complete values from `typeof` as string union */
export type TypeTable = TypePrimitive | 'undefined' | 'object' | 'function';

/** Primitives that are extended by `Record<..., any>` */
export type IndexSignature = string | number | symbol;

/** Integer-based instances of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray_objects */
export type TypedIntArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| BigUint64Array
	| BigInt64Array;

/** Complete instances of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray_objects */
export type TypedArray = TypedIntArray | Float32Array | Float64Array;
