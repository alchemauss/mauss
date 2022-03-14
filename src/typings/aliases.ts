/* <-- Basic Typing Aliases --> */

/** Nullish values, which are only `null` and `undefined` */
export type Nullish = null | undefined;
/** Basic primitives consisting of `string`, `number`, and `boolean` */
export type Primitives = string | number | boolean;
/** Primitives from `typeof` as their actual type */
export type FullPrimitives = Primitives | bigint | symbol;
/** Primitive values from `typeof` as string union */
export type TypePrimitive = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol';
/** The complete values from `typeof` as string union */
export type TypeTable = TypePrimitive | 'undefined' | 'object' | 'function';
