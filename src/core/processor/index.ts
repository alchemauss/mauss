import type { AnyFunction } from '../../typings/helpers.js';

const DURATION = 300;

/** Prevent execution of `fn` until `time` has passed */
export function debounce<F extends AnyFunction>(fn: F, time = DURATION) {
	let timeout: NodeJS.Timeout;
	return <A extends Parameters<F>>(...args: A) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), time);
	};
}

/** Immediately execute `fn` and prevent the next execution until after `time` */
export function immediate<F extends AnyFunction>(fn: F, time = DURATION) {
	let timeout: NodeJS.Timeout;
	return <A extends Parameters<F>>(...args: A) => {
		if (timeout) return;
		fn(...args);
		timeout = setTimeout(() => clearTimeout(timeout), time);
	};
}

/** Prevent executions after the first `fn` until `time` has passed  */
export function throttle<F extends AnyFunction>(fn: F, time = DURATION) {
	let wait = false;
	return <A extends Parameters<F>>(...args: A) => {
		if (wait) return;
		fn(...args), (wait = true);
		setTimeout(() => (wait = false), time);
	};
}
