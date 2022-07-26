import type { AnyFunction } from '../typings/helpers.js';

export function debounce<F extends AnyFunction>(fn: F, time = 300) {
	let timeout: NodeJS.Timeout;
	return <A extends Parameters<F>>(...args: A) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), time);
	};
}

export function throttle<F extends AnyFunction>(fn: F, time = 300) {
	let wait = false;
	return <A extends Parameters<F>>(...args: A) => {
		if (wait) return;
		fn(...args), (wait = true);
		setTimeout(() => (wait = false), time);
	};
}
