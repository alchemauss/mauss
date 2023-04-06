export { default as curry } from './curry.js';
export { default as pipe } from './pipe.js';

type Masked<T> = { $kind: 'none' } | { $kind: 'some'; value: T };

const none = { $kind: 'none' } as const;
function some<T>(v: T) {
	return { $kind: 'some', value: v } as const;
}

function cast<X, Y extends X>(fn: (x: X) => x is Y) {
	return (arg: X): Masked<Y> => {
		try {
			return fn(arg) ? some(arg) : none;
		} catch {
			return none;
		}
	};
}

export const mask = {
	of<T>(fn: () => T): Masked<T> {
		try {
			return some(fn());
		} catch {
			return none;
		}
	},

	async resolve<T>(p: Promise<T>): Promise<Masked<T>> {
		return p.then((v) => some(v)).catch(() => none);
	},

	wrap: cast(<T>(i: T | undefined | null): i is T => i != null),
} as const;

export function reveal<T>(opt: Masked<T>) {
	return {
		expect(message: string) {
			if (opt.$kind === 'some') return opt.value;
			throw new Error(message);
		},
		or(fallback: T): T {
			return opt.$kind === 'some' ? opt.value : fallback;
		},
	};
}
