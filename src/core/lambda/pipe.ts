import type { Last, UnaryFunction as Constraint } from '../../typings';

type Validator<
	Functions extends Constraint[],
	Computed extends Constraint = (v: ReturnType<Functions[0]>) => ReturnType<Functions[1]>
> = Functions extends [infer Resolved, infer _, ...infer Rest]
	? Rest extends Constraint[]
		? [Resolved, ...Validator<[Computed, ...Rest]>]
		: never // will never reach here, condition always satisfies
	: Functions;

export function pipe<F extends Constraint[]>(...functions: Validator<F>) {
	type InitialType = Parameters<F[0]>[0];
	type FinalType = ReturnType<Last<F, any>>;
	return (arg: InitialType): FinalType => {
		let pipeline = arg;
		for (let i = 0; i < functions.length; i++) {
			pipeline = functions[i](pipeline);
		}
		return pipeline;
	};
}
