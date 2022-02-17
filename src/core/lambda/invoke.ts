import type { AnyFunction } from '../../typings';

export function invoke(...parameters: AnyFunction[]) {
	const call = (f: AnyFunction | [AnyFunction, ...any]) =>
		typeof f === 'function' ? f() : f[0](...f.slice(1));
	return () => parameters.forEach(call);
}
