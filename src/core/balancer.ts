export function debounce(fn: any, time = 300) {
	let timeout: NodeJS.Timeout;
	return (...args: any[]) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), time);
	};
}

export function throttle(fn: any, time = 300) {
	let wait = false;
	return (...args: any[]) => {
		if (wait) return;
		fn(...args), (wait = true);
		setTimeout(() => (wait = false), time);
	};
}
