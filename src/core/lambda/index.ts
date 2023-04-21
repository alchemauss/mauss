export { default as curry } from './curry.js';
export { default as pipe } from './pipe.js';

function error(msg?: string) {
	const error = msg || '';
	return { kind: 'error' as const, error };
}
function success<T>(value: T) {
	return { kind: 'success' as const, value };
}

type Result<T> = ReturnType<typeof error> | ReturnType<typeof success<T>>;

function cast<X, Y extends X>(fn: (x: X) => x is Y) {
	return (arg: X): Result<Y> => {
		try {
			return fn(arg) ? success(arg) : error();
		} catch {
			return error();
		}
	};
}

export const mask = {
	of<T>(fn: () => T): Result<T> {
		try {
			return success(fn());
		} catch {
			return error();
		}
	},

	async resolve<T>(p: Promise<T>): Promise<Result<T>> {
		return p.then((v) => success(v)).catch(() => error());
	},

	wrap: cast(<T>(i: T | undefined | null): i is T => i != null),
} as const;

export function reveal<T>(opt: Result<T>) {
	return {
		expect(message: string) {
			if (opt.kind === 'success') return opt.value;
			throw new Error(message);
		},
		or(fallback: T): T {
			return opt.kind === 'success' ? opt.value : fallback;
		},
	};
}
