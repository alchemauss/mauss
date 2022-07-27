type Merge<T> = { [P in keyof T]: T[P] };

type Escapes = { r: '\r'; n: '\n'; b: '\b'; f: '\f' };
type Ignored = ' ' | '\t' | '\n' | '\r';

type Numeric = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Integer<T extends string, R extends any[] = []> = T extends `${R['length']}`
	? R['length']
	: Integer<T, [...R, any]>;

type Eval<T> = T extends `${Ignored}${infer U}`
	? Eval<U>
	: T extends `true${infer U}`
	? [true, U]
	: T extends `false${infer U}`
	? [false, U]
	: T extends `null${infer U}`
	? [null, U]
	: T extends `${infer C}${infer U}`
	? C extends Numeric
		? [Integer<C>, U]
		: C extends '"'
		? EvalString<U>
		: C extends '['
		? EvalArray<U>
		: C extends '{'
		? EvalObject<U>
		: false
	: false;

type EvalString<T, S extends string = ''> = T extends `"${infer U}`
	? [S, U]
	: (
			T extends `\\${infer C}${infer U}` ? (C extends keyof Escapes ? [C, U] : false) : false
	  ) extends [infer C, infer U]
	? EvalString<U, `${S}${C extends keyof Escapes ? Escapes[C] : never}`>
	: T extends `${infer C}${infer U}`
	? EvalString<U, `${S}${C}`>
	: false;

type EvalArray<T, Memory extends any[] = []> = T extends `${Ignored}${infer U}`
	? EvalArray<U, Memory>
	: T extends `]${infer U}`
	? [Memory, U]
	: T extends `,${infer U}`
	? EvalArray<U, Memory>
	: Eval<T> extends [infer V, infer U]
	? EvalArray<U, [...Memory, V]>
	: false;

type EvalObject<T, K extends string = '', Memory = {}> = T extends `${Ignored}${infer U}`
	? EvalObject<U, K, Memory>
	: T extends `}${infer U}`
	? [Memory, U]
	: T extends `,${infer U}`
	? EvalObject<U, K, Memory>
	: T extends `"${infer U}`
	? Eval<`"${U}`> extends [`${infer KK}`, infer UU]
		? EvalObject<UU, KK, Memory>
		: false
	: T extends `:${infer U}`
	? Eval<U> extends [infer V, infer UU]
		? EvalObject<UU, '', Merge<{ [P in K]: V } & Memory>>
		: false
	: false;

export type ParseJSON<Raw extends string> = Eval<Raw> extends [infer V, infer _] ? V : never;

type Reviver = Parameters<typeof JSON.parse>[1];
export function parse<T extends string>(str: T, reviver?: Reviver): ParseJSON<T> {
	return JSON.parse(str, reviver);
}

export type PickByValueExact<T, V> = Pick<
	T,
	{ [K in keyof T]-?: [V, T[K]] extends [T[K], V] ? K : never }[keyof T]
>;
