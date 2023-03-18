import type { AnyFunction } from '../../typings';

type InvokeParameters = AnyFunction | [AnyFunction, ...any];
export function invoke<Functions extends InvokeParameters[]>(...parameters: Functions) {
	const call = (f: InvokeParameters) => (typeof f === 'function' ? f() : f[0](...f.slice(1)));
	return () => parameters.forEach(call);
}
